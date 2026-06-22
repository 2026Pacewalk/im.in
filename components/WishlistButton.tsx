"use client";

import { useWishlist, type WishlistItem } from "@/components/WishlistProvider";

export default function WishlistButton({
  product,
  variant = "icon",
  className = "",
}: {
  product: WishlistItem;
  /** "icon" = floating heart for cards; "button" = labelled button for PDP. */
  variant?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle } = useWishlist();
  const active = has(product.id);

  function onClick(e: React.MouseEvent) {
    // Cards wrap the whole tile in a <Link>; don't navigate on heart click.
    e.preventDefault();
    e.stopPropagation();
    toggle(product);
  }

  const Heart = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill={active ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center justify-center gap-2 rounded-xl border px-5 py-3.5 font-semibold transition ${
          active
            ? "border-brand-600 bg-brand-50 text-brand-600"
            : "border-gray-200 text-gray-700 hover:border-brand-400 hover:text-brand-600"
        } ${className}`}
      >
        {Heart}
        {active ? "In Wishlist" : "Add to Wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm backdrop-blur transition hover:bg-white ${
        active ? "text-brand-600" : "text-gray-500 hover:text-brand-600"
      } ${className}`}
    >
      {Heart}
    </button>
  );
}
