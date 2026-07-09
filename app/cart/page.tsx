"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { money, decode } from "@/lib/format";

export default function CartPage() {
  const { cart, loading, update, remove, busy } = useCart();
  const items = cart?.items ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Your cart</h1>

      {loading ? (
        <p className="py-16 text-center text-gray-400">Loading cart…</p>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 py-16 text-center">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-4 inline-block rounded-lg bg-brand-600 px-6 py-2.5 font-medium text-white"
          >
            Browse invitations
          </Link>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          <ul className="divide-y divide-gray-100 lg:col-span-2">
            {items.map((item) => (
              <li key={item.key} className="flex gap-4 py-4">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0].thumbnail || item.images[0].src}
                      alt={item.images[0].alt || decode(item.name)}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col">
                  <Link
                    href={`/product/${item.permalink.split("/product/")[1] ?? ""}`}
                    className="text-sm font-medium text-gray-800 hover:text-brand-600"
                  >
                    {decode(item.name)}
                  </Link>
                  <div className="mt-auto flex items-center gap-4">
                    <div className="flex items-center rounded-lg border border-gray-200">
                      <button
                        disabled={busy}
                        onClick={() =>
                          item.quantity > 1
                            ? update(item.key, item.quantity - 1)
                            : remove(item.key)
                        }
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        −
                      </button>
                      <span className="min-w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        disabled={busy}
                        onClick={() => update(item.key, item.quantity + 1)}
                        className="px-3 py-1.5 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                    <button
                      disabled={busy}
                      onClick={() => remove(item.key)}
                      className="text-sm text-gray-400 hover:text-rose-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <span className="font-semibold">
                  {money(item.totals.line_total, item.totals)}
                </span>
              </li>
            ))}
          </ul>

          {cart && (
            <aside className="h-fit rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>
              <div className="flex items-center justify-between border-b border-gray-200 pb-3 text-sm">
                <span className="text-gray-600">
                  Subtotal ({cart.items_count} items)
                </span>
                <span className="font-semibold">
                  {money(cart.totals.total_price, cart.totals)}
                </span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
              >
                Proceed to checkout →
              </Link>
              <Link
                href="/shop"
                className="mt-3 block text-center text-sm text-gray-500 hover:text-brand-600"
              >
                Continue shopping
              </Link>
            </aside>
          )}
        </div>
      )}
    </div>
  );
}
