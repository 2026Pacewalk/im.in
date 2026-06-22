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
} from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import { getProductOptions } from "@/lib/wcpa";
import ProductCard from "@/components/ProductCard";
import ProductGallery from "@/components/ProductGallery";
import ProductOptions from "@/components/ProductOptions";
import AddToCart from "@/components/AddToCart";
import MobileBuyBar from "@/components/MobileBuyBar";

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
  const mainCat = product.categories?.[0];
  const [related, optionFields] = await Promise.all([
    mainCat
      ? getProducts({ category: mainCat.slug, perPage: 6 }).then((r) =>
          r.items.filter((p) => p.id !== product.id)
        )
      : Promise.resolve([]),
    getProductOptions(slug),
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

      <div className="grid gap-10 md:grid-cols-2">
        <ProductGallery images={product.images || []} name={name} />

        {/* Info */}
        <div>
          <h1 className="font-display text-3xl font-bold md:text-4xl">{name}</h1>

          {rating > 0 && (
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Stars rating={rating} />
              <span className="text-gray-500">
                {rating.toFixed(1)} ({product.review_count} reviews)
              </span>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-extrabold text-gray-900">
              {priceLabel}
            </span>
            {oldPriceLabel && (
              <>
                <span className="text-lg text-gray-400 line-through">
                  {oldPriceLabel}
                </span>
                <span className="rounded-full bg-rose-100 px-2.5 py-1 text-sm font-semibold text-rose-600">
                  Save {savingsPct}%
                </span>
              </>
            )}
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

          {/* Trust row */}
          <div className="mt-7 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 text-center text-xs text-gray-600">
            <div>⚡<br />Instant delivery</div>
            <div>✏️<br />Personalised</div>
            <div>💬<br />WhatsApp support</div>
          </div>

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

      {/* Full description */}
      {product.description && (
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="mb-4 font-display text-2xl font-bold">Description</h2>
          <div
            className="wp-content max-w-3xl"
            dangerouslySetInnerHTML={{ __html: cleanHtml(product.description) }}
          />
        </section>
      )}

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12 border-t border-gray-100 pt-8">
          <h2 className="mb-6 font-display text-2xl font-bold">You may also like</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {related.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
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
