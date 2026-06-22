"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { money, decode } from "@/lib/wp";

export default function CartDrawer() {
  const { cart, drawerOpen, closeDrawer, update, remove, busy } = useCart();
  const items = cart?.items ?? [];

  return (
    <div
      className={`fixed inset-0 z-[110] transition-[visibility] duration-300 ${
        drawerOpen ? "visible" : "invisible"
      }`}
      aria-hidden={!drawerOpen}
    >
      <div
        onClick={closeDrawer}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-96 max-w-[90%] flex-col bg-white shadow-2xl transition-transform duration-300 ease-out ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold">
            Your cart {cart ? `(${cart.items_count})` : ""}
          </h2>
          <button
            aria-label="Close cart"
            onClick={closeDrawer}
            className="rounded-lg p-1.5 hover:bg-gray-100"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
              <p>Your cart is empty.</p>
              <Link
                href="/shop"
                onClick={closeDrawer}
                className="mt-4 rounded-lg bg-brand-600 px-5 py-2.5 font-medium text-white"
              >
                Browse invitations
              </Link>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item.key} className="flex gap-3">
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                    {item.images?.[0] && (
                      <Image
                        src={item.images[0].thumbnail || item.images[0].src}
                        alt={item.images[0].alt || decode(item.name)}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <p className="line-clamp-2 text-sm font-medium text-gray-800">
                      {decode(item.name)}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200">
                        <button
                          disabled={busy}
                          onClick={() =>
                            item.quantity > 1
                              ? update(item.key, item.quantity - 1)
                              : remove(item.key)
                          }
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          −
                        </button>
                        <span className="min-w-7 text-center text-sm">
                          {item.quantity}
                        </span>
                        <button
                          disabled={busy}
                          onClick={() => update(item.key, item.quantity + 1)}
                          className="px-2.5 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                        >
                          +
                        </button>
                      </div>
                      <span className="text-sm font-semibold">
                        {money(item.totals.line_total, item.totals)}
                      </span>
                    </div>
                  </div>
                  <button
                    aria-label="Remove"
                    disabled={busy}
                    onClick={() => remove(item.key)}
                    className="self-start text-gray-300 hover:text-rose-500"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="6" y1="6" x2="18" y2="18" />
                      <line x1="18" y1="6" x2="6" y2="18" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && cart && (
          <div className="border-t border-gray-100 p-4">
            <div className="mb-3 flex items-center justify-between text-base font-semibold">
              <span>Subtotal</span>
              <span>{money(cart.totals.total_price, cart.totals)}</span>
            </div>
            <Link
              href="/checkout"
              onClick={closeDrawer}
              className="block rounded-xl bg-brand-600 px-6 py-3 text-center font-semibold text-white hover:bg-brand-700"
            >
              Checkout →
            </Link>
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="mt-2 block text-center text-sm text-gray-500 hover:text-brand-600"
            >
              View full cart
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
