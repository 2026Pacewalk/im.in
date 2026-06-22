"use client";

import { useCart } from "@/components/CartProvider";

export default function CartButton() {
  const { cart, openDrawer } = useCart();
  const count = cart?.items_count ?? 0;

  return (
    <button
      type="button"
      onClick={openDrawer}
      aria-label="Open cart"
      className="relative rounded-lg p-2 text-gray-700 hover:bg-gray-100"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}
