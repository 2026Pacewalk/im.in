import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getProducts,
  getYoast,
  decode,
  formatPrice,
  cleanHtml,
  productIntro,
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import { getProductOptions } from "@/lib/wcpa";
import { getProductVideo } from "@/lib/product-media";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductVideo from "@/components/product/ProductVideo";
import ProductOptions from "@/components/ProductOptions";
import AddToCart from "@/components/AddToCart";
import MobileBuyBar from "@/components/MobileBuyBar";
import WishlistButton from "@/components/WishlistButton";
import TrustBadges from "@/components/product/TrustBadges";
import Highlights from "@/components/product/Highlights";
import HowToOrder from "@/components/product/HowToOrder";
import WhyChooseUs from "@/components/product/WhyChooseUs";
import AtAGlance from "@/components/product/AtAGlance";

export const revalidate = 3600;

export async function generateMetadata(
  props: PageProps<"/product/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const [yoast, product] = await Promise.all([
    getYoast("product", slug),
    getProductBySlug(slug),
  ]);
  return yoastToMetadata(yoast, {
    title: product ? `${decode(product.name)} | InviteMart` : "Product | InviteMart",
    description: product
      ? decode(product.short_description).replace(/<[^>]+>/g, "").slice(0, 160)
      : undefined,
  });
}

function Stars({ rating }: { rating: number }) {
  const full = Math.round(rating);
  return (
    <span className="text-amber-400" aria-label={`${rating} out of 5`}>
      {"★".repeat(full)}
      <span className="text-gray-300">{"★".repeat(5 - full)}</span>
    </span>
  );
}

export default async function ProductPage(
  props: PageProps<"/product/[slug]">
) {
  const { slug } = await props.params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const name = decode(product.name);
  const isVideo = /video/i.test(product.slug) || /video/i.test(product.name);
  const mainCat = product.categories?.[0];
  const [related, optionFields, videoUrl] = await Promise.all([
    mainCat
      ? getProducts({ category: mainCat.slug, perPage: 6 }).then((r) =>
          r.items.filter((p) => p.id !== product.id)
        )
      : Promise.resolve([]),
    getProductOptions(slug),
    getProductVideo(slug),
  ]);
  const hasOptions = optionFields.length > 0;
  const basePrice =
    Number(product.prices?.price || 0) /
    Math.pow(10, product.prices?.currency_minor_unit || 2);

  const rating = Number(product.average_rating) || 0;
  const reg = Number(product.prices?.regular_price);
  const sale = Number(product.prices?.sale_price);
  const savingsPct =
    product.on_sale && reg > 0 && sale < reg
      ? Math.round((1 - sale / reg) * 100)
      : 0;

  const priceLabel = formatPrice(product.prices, product.prices?.sale_price);
  const oldPriceLabel =
    savingsPct > 0
      ? formatPrice(product.prices, product.prices?.regular_price)
      : undefined;

  // Only the genuine intro copy — boilerplate (steps, hashtags, promo links) is
  // stripped and replaced by our designed HowToOrder / WhyChooseUs sections.
  const intro = productIntro(product.description, name);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-24 md:pb-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1 text-sm text-gray-500">
        <Link href="/" className="hover:text-brand-600">Home</Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-brand-600">Shop</Link>
        {mainCat && (
          <>
            <span>/</span>
            <Link
              href={`/product-category/${mainCat.slug}`}
              className="hover:text-brand-600"
            >
              {decode(mainCat.name)}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        {/* Gallery (sticky on desktop) */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <ProductGallery images={product.images || []} name={name} />
          {videoUrl && (
            <div className="mt-3">
              <ProductVideo
                url={videoUrl}
                name={name}
                poster={product.images?.[0]?.src}
              />
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {mainCat && (
            <Link
              href={`/product-category/${mainCat.slug}`}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-gold transition hover:text-brand-600"
            >
              {decode(mainCat.name)}
            </Link>
          )}
          <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink md:text-4xl">
            {name}
          </h1>

          {/* Rating / social proof */}
          <div className="mt-3 flex items-center gap-2 text-sm">
            <Stars rating={rating > 0 ? rating : 5} />
            {rating > 0 ? (
              <span className="text-gray-500">
                {rating.toFixed(1)} ({product.review_count} reviews)
              </span>
            ) : (
              <span className="text-gray-500">Loved by 50,000+ happy customers</span>
            )}
          </div>

          {/* Price card */}
          <div className="mt-6 rounded-2xl border border-gold/20 bg-gradient-to-br from-cream to-white p-5 shadow-sm">
            <div className="flex flex-wrap items-baseline gap-3">
              {hasOptions && (
                <span className="text-sm font-medium text-gray-500">From</span>
              )}
              <span className="font-display text-4xl font-extrabold text-ink">
                {priceLabel}
              </span>
              {oldPriceLabel && (
                <>
                  <span className="text-lg text-gray-400 line-through">
                    {oldPriceLabel}
                  </span>
                  <span className="rounded-full bg-brand-600 px-2.5 py-1 text-sm font-semibold text-white">
                    Save {savingsPct}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <span className="text-brand-600">✓</span>
              Inclusive of all taxes · Instant digital delivery
            </p>
          </div>

          {product.short_description && (
            <div
              className="wp-content mt-5 text-sm"
              dangerouslySetInnerHTML={{
                __html: cleanHtml(product.short_description),
              }}
            />
          )}

          {hasOptions ? (
            <ProductOptions
              fields={optionFields}
              basePrice={basePrice}
              productId={product.id}
              productName={name}
              permalink={product.permalink}
            />
          ) : (
            <div className="mt-7">
              <AddToCart productId={product.id} permalink={product.permalink} />
            </div>
          )}

          <div className="mt-3">
            <WishlistButton product={product} variant="button" className="w-full sm:w-auto" />
          </div>

          {/* What you'll get */}
          <Highlights isVideo={isVideo} />

          {/* Trust badges */}
          <TrustBadges />

          {product.categories?.length > 0 && (
            <div className="mt-6 text-sm text-gray-500">
              <span className="font-medium text-gray-700">Categories: </span>
              {product.categories.map((c, i) => (
                <span key={c.id}>
                  <Link
                    href={`/product-category/${c.slug}`}
                    className="hover:text-brand-600"
                  >
                    {decode(c.name)}
                  </Link>
                  {i < product.categories.length - 1 ? ", " : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* About this design (cleaned intro only) */}
      {intro && (
        <section className="mt-16 border-t border-black/5 pt-10">
          <h2 className="font-display text-2xl font-bold text-ink">About this design</h2>
          <div className="gold-rule mt-3 w-16" />
          <div className="mt-6 grid gap-10 lg:grid-cols-3">
            <div
              className="wp-content text-justify leading-relaxed [hyphens:auto] [&_p]:text-justify lg:col-span-2"
              dangerouslySetInnerHTML={{ __html: intro }}
            />
            <AtAGlance isVideo={isVideo} />
          </div>
        </section>
      )}

      {/* Designed sections that replace the merchant boilerplate */}
      <HowToOrder />
      <WhyChooseUs />

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16 border-t border-black/5 pt-10">
          <h2 className="font-display text-2xl font-bold text-ink">You may also like</h2>
          <div className="gold-rule mt-3 w-16" />
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {related.slice(0, 5).map((p) => (
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

      {!hasOptions && (
        <MobileBuyBar
          productId={product.id}
          priceLabel={priceLabel}
          oldPriceLabel={oldPriceLabel}
        />
      )}
    </div>
  );
}
