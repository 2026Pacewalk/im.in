import type { Metadata } from "next";
import Link from "next/link";
import { getProducts, getAllStoreCategories, decode } from "@/lib/wp";

export const metadata: Metadata = {
  title: "Sitemap | InviteMart",
  description:
    "Browse every page, category and design on InviteMart — digital invitation cards, eCards, PDFs and invitation videos for every occasion.",
  alternates: { canonical: "/site-map" },
};

export const revalidate = 86400;

const PAGES: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Shop All Designs", href: "/shop" },
  { label: "AI Invitation Maker", href: "/ai-invitation-maker" },
  { label: "Free Festival Invitations", href: "/free-festival-invitations" },
  { label: "Wedding Invitations", href: "/wedding-invitations" },
  { label: "Caricature Invitations", href: "/caricature-invitations" },
  { label: "RSVP", href: "/rsvp" },
  { label: "Blog", href: "/blog" },
  { label: "Discount & Coupon Codes", href: "/discount-offers-coupon-code" },
  { label: "Become a Reseller", href: "/become-a-reseller" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "About Us", href: "/about-us" },
  { label: "GST Pay Online", href: "/gst-pay-online" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Return Policy", href: "/return-policy" },
];

function Section({ title, count, children }: { title: string; count?: number; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="flex items-baseline gap-3 font-display text-xl font-bold text-ink">
        {title}
        {count != null && (
          <span className="text-sm font-medium text-gray-400">{count.toLocaleString("en-IN")}</span>
        )}
      </h2>
      <div className="gold-rule mt-3 w-16" />
      <div className="mt-5">{children}</div>
    </section>
  );
}

export default async function SitemapPage() {
  const [productsRes, categories] = await Promise.all([
    getProducts({ perPage: 5000, orderby: "title", order: "asc" }).catch(() => ({ items: [] as { slug: string; name: string }[] })),
    getAllStoreCategories().catch(() => [] as { slug: string; name: string; count: number }[]),
  ]);
  const products = productsRes.items;
  const cats = [...categories].sort((a, b) => (b.count ?? 0) - (a.count ?? 0));

  return (
    <div className="bg-cream pb-16">
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-6xl px-4 py-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            Everything on InviteMart
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Sitemap</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            All our pages, occasions and {products.length.toLocaleString("en-IN")} invitation designs in one place.
          </p>
          <a
            href="/sitemap.xml"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-brand-700 shadow-sm transition hover:bg-cream"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <path d="M14 2v6h6M9 13h6M9 17h4" />
            </svg>
            View XML Sitemap
          </a>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <Section title="Main Pages">
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
            {PAGES.map((p) => (
              <li key={p.href}>
                <Link href={p.href} className="text-sm text-gray-700 transition hover:text-brand-600 hover:underline">
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Shop by Category" count={cats.length}>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3 md:grid-cols-4">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link href={`/product-category/${c.slug}`} className="text-sm text-gray-700 transition hover:text-brand-600 hover:underline">
                  {decode(c.name)}
                  <span className="ml-1 text-xs text-gray-400">({c.count})</span>
                </Link>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="All Invitation Designs" count={products.length}>
          <ul className="grid grid-cols-1 gap-x-6 gap-y-1.5 sm:grid-cols-2 md:grid-cols-3">
            {products.map((p) => (
              <li key={p.slug}>
                <Link href={`/product/${p.slug}`} className="line-clamp-1 text-sm text-gray-600 transition hover:text-brand-600 hover:underline">
                  {decode(p.name)}
                </Link>
              </li>
            ))}
          </ul>
        </Section>
      </div>
    </div>
  );
}
