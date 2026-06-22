import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProducts,
  getTermBySlug,
  getYoast,
  decode,
  internalizeLinks,
  SITE,
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import {
  titleizeSlug,
  categoryIntro,
  categoryFaqs,
} from "@/lib/category-seo";
import ProductGrid from "@/components/ProductGrid";
import SortBar from "@/components/SortBar";

export const revalidate = 3600;

// In WordPress, product categories are hierarchical
// (e.g. /product-category/baby-kids/birthday-party-invitation/).
// The final segment is the actual category slug.
function leaf(slug: string[]): string {
  return slug[slug.length - 1];
}

export async function generateMetadata(
  props: PageProps<"/product-category/[...slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const catSlug = leaf(slug);
  const [yoast, term] = await Promise.all([
    getYoast("product_cat", catSlug),
    getTermBySlug("product_cat", catSlug),
  ]);
  return yoastToMetadata(yoast, {
    title: term ? `${decode(term.name)} | InviteMart` : "Category | InviteMart",
    description: term?.description
      ? decode(term.description).replace(/<[^>]+>/g, "").slice(0, 160)
      : undefined,
  });
}

export default async function CategoryPage(
  props: PageProps<"/product-category/[...slug]">
) {
  const { slug } = await props.params;
  const sp = await props.searchParams;
  const catSlug = leaf(slug);
  const page = Number(typeof sp.page === "string" ? sp.page : 1) || 1;

  const orderby =
    typeof sp.orderby === "string"
      ? (sp.orderby as "date" | "price" | "popularity" | "rating" | "title")
      : "popularity";
  const onSale = sp.on_sale === "1";

  const term = await getTermBySlug("product_cat", catSlug);
  if (!term) notFound();

  const { items, total, totalPages } = await getProducts({
    category: catSlug,
    page,
    perPage: 24,
    orderby,
    order: orderby === "price" || orderby === "title" ? "asc" : "desc",
    onSale,
  });

  const name = decode(term.name);
  const count = term.count || total;
  // Use the WP description when it's substantial; otherwise a generated intro
  // so the page always has unique, keyword-rich on-page copy.
  const wpText = term.description
    ? internalizeLinks(term.description)
    : "";
  const hasRichDescription = wpText.replace(/<[^>]+>/g, "").trim().length > 120;
  const faqs = categoryFaqs(name, count);

  // Breadcrumb trail from the URL segments.
  const crumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...slug.map((seg, i) => ({
      label: i === slug.length - 1 ? name : titleizeSlug(seg),
      href: `/product-category/${slug.slice(0, i + 1).join("/")}`,
    })),
  ];

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${SITE}${c.href}`,
    })),
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-4 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {crumbs.map((c, i) => (
          <span key={c.href} className="flex items-center gap-1">
            {i > 0 && <span>/</span>}
            {i < crumbs.length - 1 ? (
              <Link href={c.href} className="hover:text-brand-600">
                {c.label}
              </Link>
            ) : (
              <span className="text-gray-700">{c.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex flex-wrap items-baseline gap-3">
        <h1 className="font-display text-3xl font-bold md:text-4xl">{name}</h1>
        {count > 0 && (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">
            {count} designs
          </span>
        )}
      </div>

      {/* Products first */}
      <div className="mt-6">
        <SortBar total={total} />
        <ProductGrid
          products={items}
          page={page}
          totalPages={totalPages}
          basePath={`/product-category/${slug.join("/")}`}
          query={{ orderby, on_sale: onSale ? "1" : undefined }}
        />
      </div>

      {/* About this category (SEO content, below the products) */}
      <section className="mt-14 border-t border-black/5 pt-10">
        <h2 className="font-display text-2xl font-bold text-ink">About {name}</h2>
        <div className="gold-rule mt-3 w-16" />
        {hasRichDescription ? (
          <div
            className="wp-content mt-5 max-w-3xl text-sm leading-relaxed text-justify [&_p]:text-justify"
            dangerouslySetInnerHTML={{ __html: wpText }}
          />
        ) : (
          <p className="mt-5 max-w-3xl text-sm leading-relaxed text-justify text-gray-600">
            {categoryIntro(name, count)}
          </p>
        )}
      </section>

      {/* Category FAQ */}
      <section className="mt-12 border-t border-black/5 pt-10">
        <h2 className="font-display text-2xl font-bold text-ink">
          {name}: frequently asked questions
        </h2>
        <div className="mt-5 max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-black/5 bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {f.q}
                <span className="text-gold transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </div>
  );
}
