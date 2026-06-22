"use client";

import Link from "next/link";
import { useWishlist } from "@/components/WishlistProvider";
import ProductCard from "@/components/ProductCard";

export default function WishlistPage() {
  const { items, count, ready, clear } = useWishlist();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink md:text-4xl">
            My Wishlist
          </h1>
          <div className="gold-rule mt-3 w-16" />
        </div>
        {count > 0 && (
          <button
            type="button"
            onClick={clear}
            className="text-sm font-medium text-gray-500 hover:text-rose-600"
          >
            Clear all
          </button>
        )}
      </div>

      {!ready ? (
        <p className="py-20 text-center text-gray-400">Loading…</p>
      ) : count === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white py-20 text-center">
          <div className="mb-4 text-5xl">🤍</div>
          <p className="text-gray-600">Your wishlist is empty.</p>
          <p className="mt-1 text-sm text-gray-400">
            Tap the heart on any design to save it here.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Browse invitations
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 text-sm text-gray-500">
            {count} {count === 1 ? "item" : "items"} saved
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
