import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getProducts,
  getTermBySlug,
  getYoast,
  decode,
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="font-display text-3xl font-bold md:text-4xl">{decode(term.name)}</h1>
      {term.description && (
        <div
          className="wp-content mt-3 max-w-3xl text-sm"
          dangerouslySetInnerHTML={{ __html: term.description }}
        />
      )}

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
    </div>
  );
}
