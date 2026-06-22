import Image from "next/image";
import Link from "next/link";
import { decode, formatPrice, type StoreProduct } from "@/lib/wp";

export default function ProductCard({ product }: { product: StoreProduct }) {
  const img = product.images?.[0];
  const href = `/product/${product.slug}`;
  const name = decode(product.name);
  const reg = Number(product.prices?.regular_price);
  const sale = Number(product.prices?.sale_price);
  const savings =
    product.on_sale && reg > 0 && sale < reg
      ? Math.round((1 - sale / reg) * 100)
      : 0;

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-xl"
    >
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
  );
}
