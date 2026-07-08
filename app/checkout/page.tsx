"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { money, decode } from "@/lib/wp";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa",
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala",
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland",
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman & Nicobar Islands",
  "Chandigarh", "Dadra & Nagar Haveli and Daman & Diu", "Delhi", "Jammu & Kashmir",
  "Ladakh", "Lakshadweep", "Puducherry",
];

const EMPTY = {
  name: "", email: "", phone: "", address: "", city: "", state: "", pincode: "",
};

export default function CheckoutPage() {
  const { cart, loading } = useCart();
  const items = cart?.items ?? [];
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function set<K extends keyof typeof EMPTY>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function pay(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok || !data.redirectUrl) {
        throw new Error(data.error || "Could not start payment.");
      }
      // Hand the customer to PhonePe's hosted checkout.
      window.location.href = data.redirectUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment could not be started.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
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
        <div className="grid gap-8 lg:grid-cols-5">
          {/* Billing / delivery form */}
          <form onSubmit={pay} className="lg:col-span-3">
            <h2 className="mb-4 text-lg font-bold">Billing details</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" className="sm:col-span-2">
                <input required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} placeholder="Your name" />
              </Field>
              <Field label="Email">
                <input required type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} placeholder="you@example.com" />
              </Field>
              <Field label="Phone (10-digit)">
                <input required inputMode="numeric" maxLength={10} value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/\D/g, ""))} className={inputCls} placeholder="9876543210" />
              </Field>
              <Field label="Address" className="sm:col-span-2">
                <input required value={form.address} onChange={(e) => set("address", e.target.value)} className={inputCls} placeholder="House no., street, area" />
              </Field>
              <Field label="City">
                <input required value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="City" />
              </Field>
              <Field label="State">
                <select required value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls}>
                  <option value="">Select state…</option>
                  {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </Field>
              <Field label="Pincode (6-digit)">
                <input required inputMode="numeric" maxLength={6} value={form.pincode} onChange={(e) => set("pincode", e.target.value.replace(/\D/g, ""))} className={inputCls} placeholder="140603" />
              </Field>
            </div>

            {error && (
              <p className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-lg font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? "Redirecting to PhonePe…" : (
                <>Pay {cart ? money(cart.totals.total_price, cart.totals) : ""} with PhonePe →</>
              )}
            </button>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
              <span>🔒 Secured by PhonePe</span>
              <span>·</span>
              <span>UPI · Cards · Netbanking · Wallets</span>
            </div>
          </form>

          {/* Order summary */}
          <aside className="lg:col-span-2">
            <div className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
              <h2 className="mb-4 text-lg font-bold">Order summary</h2>
              <ul className="divide-y divide-gray-200">
                {items.map((item) => (
                  <li key={item.key} className="flex items-center gap-3 py-3">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-gray-100 bg-white">
                      {item.images?.[0] && (
                        <Image
                          src={item.images[0].thumbnail || item.images[0].src}
                          alt={item.images[0].alt || decode(item.name)}
                          fill
                          sizes="56px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 text-sm">
                      <p className="line-clamp-1 font-medium text-gray-800">{decode(item.name)}</p>
                      <p className="text-gray-500">Qty {item.quantity}</p>
                    </div>
                    <span className="text-sm font-semibold">{money(item.totals.line_total, item.totals)}</span>
                  </li>
                ))}
              </ul>
              {cart && (
                <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold">
                  <span>Total</span>
                  <span>{money(cart.totals.total_price, cart.totals)}</span>
                </div>
              )}
              <p className="mt-4 text-xs text-gray-500">
                Personalisation details are collected after your order is placed
                (via WhatsApp/email).
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-200";

function Field({ label, className = "", children }: { label: string; className?: string; children: React.ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-sm font-medium text-gray-700">{label}</span>
      {children}
    </label>
  );
}
