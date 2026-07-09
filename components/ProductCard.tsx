import Image from "next/image";
import Link from "next/link";
import { decode, formatPrice } from "@/lib/format";
import WishlistButton from "@/components/WishlistButton";
import type { WishlistItem } from "@/components/WishlistProvider";

// Accepts the subset of product fields a card needs (a full StoreProduct is
// assignable), so the same card renders both API products and wishlist items.
export default function ProductCard({ product }: { product: WishlistItem }) {
  const img = product.images?.[0];
  const href = `/product/${product.slug}`;
  const name = decode(product.name);
  const reg = Number(product.prices?.regular_price);
  const sale = Number(product.prices?.sale_price);
  const savings =
    product.on_sale && reg > 0 && sale < reg
      ? Math.round((1 - sale / reg) * 100)
      : 0;
  const isVideo = /video/i.test(product.slug) || /video/i.test(product.name);

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Heart sits outside the <Link> so we never nest a button in an anchor. */}
      <WishlistButton product={product} className="absolute right-2.5 top-2.5 z-10" />

      <Link href={href} className="flex flex-1 flex-col">
        <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-brand-50 to-cream">
          {img ? (
            <Image
              src={img.src}
              alt={img.alt ? decode(img.alt) : name}
              fill
              sizes="(max-width: 768px) 50vw, 20vw"
              className="object-cover transition duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center p-4 text-center text-sm font-medium text-brand-400">
              {name}
            </div>
          )}
          {savings > 0 && (
            <span className="absolute left-2.5 top-2.5 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white shadow">
              −{savings}%
            </span>
          )}
          {isVideo && (
            <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
              Video
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-3.5">
          <h3 className="line-clamp-2 text-sm font-medium text-ink/90 transition group-hover:text-brand-600">
            {name}
          </h3>
          <div className="mt-auto flex items-baseline gap-2 pt-2.5">
            <span className="font-semibold text-ink">
              {formatPrice(product.prices, product.prices?.sale_price)}
            </span>
            {savings > 0 && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.prices, product.prices?.regular_price)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
