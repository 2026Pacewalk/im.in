"use client";

import { useCart } from "@/components/CartProvider";

export default function MobileBuyBar({
  productId,
  priceLabel,
  oldPriceLabel,
}: {
  productId: number;
  priceLabel: string;
  oldPriceLabel?: string;
}) {
  const { add, busy } = useCart();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-gray-200 bg-white/95 px-4 py-3 backdrop-blur md:hidden">
      <div className="leading-tight">
        <div className="text-lg font-extrabold text-gray-900">{priceLabel}</div>
        {oldPriceLabel && (
          <div className="text-xs text-gray-400 line-through">{oldPriceLabel}</div>
        )}
      </div>
      <button
        onClick={() => add(productId, 1)}
        disabled={busy}
        className="flex-1 rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white disabled:opacity-60"
      >
        {busy ? "Adding…" : "Add to Cart"}
      </button>
    </div>
  );
}
