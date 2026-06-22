import Image from "next/image";
import Link from "next/link";
import {
  decode,
  cleanArticleHtml,
  readingTime,
  type WpContentNode,
  type StoreProduct,
} from "@/lib/wp";
import ShareButtons from "@/components/blog/ShareButtons";
import PostCard from "@/components/PostCard";
import ProductCard from "@/components/ProductCard";

export default function BlogArticle({
  node,
  related,
  products = [],
  productTerm = "",
}: {
  node: WpContentNode;
  related: WpContentNode[];
  products?: StoreProduct[];
  productTerm?: string;
}) {
  const title = decode(node.title.rendered);
  const featured = node._embedded?.["wp:featuredmedia"]?.[0];
  const html = cleanArticleHtml(node.content.rendered);
  const mins = readingTime(node.content.rendered);
  const dateLabel = node.date
    ? new Date(node.date).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return (
    <article className="pb-4">
      {/* Header band */}
      <div className="border-b border-black/5 bg-gradient-to-b from-cream to-white">
        <div className="mx-auto max-w-3xl px-4 py-10">
          <nav className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
            <Link href="/" className="hover:text-brand-600">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-brand-600">Blog</Link>
          </nav>

          <span className="mt-5 inline-block rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            Tips &amp; Ideas
          </span>

          <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-ink md:text-[2.6rem]">
            {title}
          </h1>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-sm font-bold text-white">
                IM
              </span>
              <span className="text-sm leading-tight">
                <span className="block font-semibold text-ink">InviteMart Team</span>
                <span className="block text-gray-500">
                  {dateLabel}
                  {dateLabel && " · "}
                  {mins} min read
                </span>
              </span>
            </div>
            <ShareButtons title={title} />
          </div>
        </div>
      </div>

      {/* Featured image */}
      {featured?.source_url && (
        <div className="mx-auto max-w-4xl px-4">
          <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5">
            <Image
              src={featured.source_url}
              alt={featured.alt_text ? decode(featured.alt_text) : title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Body */}
      <div
        className="wp-content prose-blog mx-auto mt-10 max-w-3xl px-4"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Share again + back */}
      <div className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-between gap-4 border-t border-black/5 px-4 pt-6">
        <Link href="/blog" className="text-sm font-semibold text-brand-600 hover:text-brand-700">
          ← Back to all articles
        </Link>
        <ShareButtons title={title} />
      </div>

      {/* Shop related designs (idea borrowed from the live post) */}
      {products.length > 0 && (
        <section className="mx-auto mt-14 max-w-7xl px-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                Shop {productTerm ? `${productTerm} ` : "related "}designs
              </h2>
              <div className="gold-rule mt-3 w-16" />
            </div>
            <a
              href={`/shop?q=${encodeURIComponent(productTerm)}`}
              className="text-sm font-semibold text-brand-600 hover:text-brand-700"
            >
              View all →
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {products.slice(0, 5).map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  prices: p.prices,
                  images: p.images,
                  on_sale: p.on_sale,
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA band */}
      <section className="mx-auto mt-12 max-w-5xl px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-700 via-brand-800 to-ink px-6 py-10 text-center text-white md:px-12">
          <h2 className="font-display text-2xl font-bold md:text-3xl">
            Ready to create your own invitation?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Browse 1,800+ designs or generate one free in seconds with our AI maker.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/shop" className="rounded-full bg-white px-7 py-3 font-semibold text-brand-700 transition hover:bg-cream">
              Browse designs
            </Link>
            <Link href="/ai-invitation-maker" className="rounded-full border border-white/30 px-7 py-3 font-semibold text-white transition hover:border-gold hover:text-gold-soft">
              ✦ Try the AI Maker
            </Link>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto mt-14 max-w-7xl px-4">
          <h2 className="font-display text-2xl font-bold text-ink">Keep reading</h2>
          <div className="gold-rule mt-3 w-16" />
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.slice(0, 3).map((p) => (
              <PostCard key={p.id} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
