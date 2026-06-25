"use client";

import { useState } from "react";
import Link from "next/link";

export interface Coupon {
  code: string;
  title: string;
  discount: string;
  desc: string;
  status: "active" | "expired";
  used?: string;
}

export default function CouponCard({ coupon }: { coupon: Coupon }) {
  const [copied, setCopied] = useState(false);
  const expired = coupon.status === "expired";

  function copy() {
    navigator.clipboard?.writeText(coupon.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div
      className={`relative flex overflow-hidden rounded-2xl border shadow-sm transition ${
        expired
          ? "border-gray-200 bg-gray-50 opacity-75"
          : "border-black/5 bg-white hover:-translate-y-1 hover:shadow-lg"
      }`}
    >
      {/* Left stub */}
      <div
        className={`flex w-28 shrink-0 flex-col items-center justify-center px-3 text-center text-white ${
          expired
            ? "bg-gray-400"
            : "bg-gradient-to-br from-brand-600 to-brand-800"
        }`}
      >
        <span className="font-display text-2xl font-extrabold leading-none">
          {coupon.discount.split(" ")[0]}
        </span>
        <span className="mt-1 text-[11px] uppercase tracking-wide text-white/80">
          OFF
        </span>
      </div>

      {/* Notch */}
      <div className="relative w-0">
        <span className="absolute -left-2 -top-2 h-4 w-4 rounded-full bg-cream" />
        <span className="absolute -left-2 -bottom-2 h-4 w-4 rounded-full bg-cream" />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-bold text-ink">{coupon.title}</h3>
          <span
            className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
              expired
                ? "bg-gray-200 text-gray-500"
                : "bg-green-100 text-green-700"
            }`}
          >
            {expired ? "Expired" : "Active"}
          </span>
        </div>
        <p className="mt-1 text-sm text-gray-600">{coupon.desc}</p>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex flex-1 items-center justify-between rounded-lg border border-dashed border-brand-300 bg-brand-50 px-3 py-2">
            <span className="font-mono text-sm font-bold tracking-wider text-brand-700">
              {coupon.code}
            </span>
          </div>
          {expired ? (
            <span className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-400">
              Expired
            </span>
          ) : (
            <button
              onClick={copy}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              {copied ? "Copied!" : "Copy Code"}
            </button>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{coupon.used ? `✓ ${coupon.used}` : "✓ Verified"}</span>
          {!expired && (
            <Link href="/shop" className="font-semibold text-brand-600 hover:text-brand-700">
              Shop now →
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
