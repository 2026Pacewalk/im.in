"use client";

import { useCart } from "@/components/CartProvider";

export default function AddToCart({
  productId,
  permalink,
}: {
  productId: number;
  permalink: string;
}) {
  const { add, busy, error } = useCart();

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          onClick={() => add(productId, 1)}
          disabled={busy}
          className="flex-1 rounded-xl bg-brand-600 px-6 py-3.5 text-center font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
        >
          {busy ? "Adding…" : "Add to Cart"}
        </button>
        <a
          href={permalink}
          className="rounded-xl border border-gray-200 px-6 py-3.5 text-center font-semibold text-gray-700 hover:border-brand-400 hover:text-brand-600"
        >
          Personalise on site
        </a>
      </div>
      {error && <p className="text-sm text-rose-600">{error}</p>}
      <p className="text-xs text-gray-400">
        Personalisation details are collected after ordering (via WhatsApp/email).
      </p>
    </div>
  );
}
