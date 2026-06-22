"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { money, decode, SITE } from "@/lib/wp";

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const items = cart?.items ?? [];

  // Hand off to the live WooCommerce checkout where PhonePe payment runs.
  // A single-item cart can be re-created on the live site via add-to-cart;
  // multi-item carts transfer automatically once this app is deployed on the
  // same domain as WordPress.
  function handoffUrl(): string {
    if (!cart || items.length === 0) return `${SITE}/shop/`;
    if (items.length === 1) {
      const it = items[0];
      return `${SITE}/checkout/?add-to-cart=${it.id}&quantity=${it.quantity}`;
    }
    return `${SITE}/checkout/`;
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold md:text-3xl">Checkout</h1>

      {loading ? (
        <p className="py-16 text-center text-gray-400">Loading…</p>
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
        <>
          <ul className="divide-y divide-gray-100 rounded-2xl border border-gray-100">
            {items.map((item) => (
              <li key={item.key} className="flex items-center gap-4 p-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-gray-50">
                  {item.images?.[0] && (
                    <Image
                      src={item.images[0].thumbnail || item.images[0].src}
                      alt={item.images[0].alt || decode(item.name)}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 text-sm">
                  <p className="font-medium text-gray-800">{decode(item.name)}</p>
                  <p className="text-gray-500">Qty {item.quantity}</p>
                </div>
                <span className="font-semibold">
                  {money(item.totals.line_total, item.totals)}
                </span>
              </li>
            ))}
          </ul>

          {cart && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-50 px-6 py-4 text-lg font-bold">
              <span>Total</span>
              <span>{money(cart.totals.total_price, cart.totals)}</span>
            </div>
          )}

          <a
            href={handoffUrl()}
            className="mt-6 block rounded-xl bg-brand-600 px-6 py-4 text-center text-lg font-semibold text-white shadow-sm hover:bg-brand-700"
          >
            Continue to secure payment →
          </a>

          <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-gray-600">
            <p className="font-medium text-gray-800">🔒 Secure payment</p>
            <p className="mt-1">
              Payment is completed on InviteMart&apos;s secure checkout
              (UPI/cards via PhonePe). You&apos;ll add delivery details and any
              personalisation notes there.
            </p>
            {items.length > 1 && (
              <p className="mt-2 text-xs text-gray-500">
                Note: in this local preview, multi-item carts open the live
                checkout on the main site. Once deployed on the same domain, the
                full cart transfers automatically.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
