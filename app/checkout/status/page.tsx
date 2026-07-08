"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";

type View = "checking" | "paid" | "failed" | "pending";

function StatusInner() {
  const params = useSearchParams();
  const orderId = params.get("orderId") || "";
  const { cart, remove } = useCart();
  const [view, setView] = useState<View>("checking");
  const cleared = useRef(false);

  useEffect(() => {
    if (!orderId) {
      setView("failed");
      return;
    }
    let tries = 0;
    let stop = false;
    async function poll() {
      try {
        const res = await fetch(`/api/phonepe/status/${orderId}`, { cache: "no-store" });
        const data = await res.json();
        if (data.status === "PAID") return setView("paid");
        if (data.status === "FAILED") return setView("failed");
      } catch {
        /* keep polling */
      }
      tries += 1;
      if (tries >= 6) return setView("pending");
      if (!stop) setTimeout(poll, 2500);
    }
    poll();
    return () => {
      stop = true;
    };
  }, [orderId]);

  // Empty the cart once payment is confirmed.
  useEffect(() => {
    if (view === "paid" && !cleared.current && cart?.items?.length) {
      cleared.current = true;
      cart.items.forEach((i) => remove(i.key));
    }
  }, [view, cart, remove]);

  if (view === "checking") {
    return (
      <Shell>
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
        <h1 className="mt-6 text-2xl font-bold">Confirming your payment…</h1>
        <p className="mt-2 text-gray-500">Please don&apos;t close this window.</p>
      </Shell>
    );
  }

  if (view === "paid") {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">✓</div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment successful!</h1>
        <p className="mt-2 text-gray-600">
          Thank you — your order is confirmed. Order ref:{" "}
          <span className="font-mono font-semibold">{orderId}</span>
        </p>
        <p className="mt-2 text-sm text-gray-500">
          Our team will reach out on WhatsApp/email to collect your
          personalisation details.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/shop" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Continue shopping</Link>
          <a href="https://wa.me/917307344844" target="_blank" rel="noopener noreferrer" className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-brand-400">Message on WhatsApp</a>
        </div>
      </Shell>
    );
  }

  if (view === "pending") {
    return (
      <Shell>
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">⏳</div>
        <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment pending</h1>
        <p className="mt-2 text-gray-600">
          We haven&apos;t received confirmation yet. If money was debited, it will
          reflect shortly — please don&apos;t pay again. Order ref:{" "}
          <span className="font-mono font-semibold">{orderId}</span>
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <a href="https://wa.me/917307344844" target="_blank" rel="noopener noreferrer" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Check with us on WhatsApp</a>
          <Link href="/shop" className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-brand-400">Back to shop</Link>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-100 text-3xl">✕</div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">Payment failed</h1>
      <p className="mt-2 text-gray-600">
        Your payment didn&apos;t go through and you have not been charged. Please
        try again.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link href="/checkout" className="rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white hover:bg-brand-700">Try again</Link>
        <Link href="/cart" className="rounded-xl border border-gray-200 px-6 py-3 font-semibold text-gray-700 hover:border-brand-400">Back to cart</Link>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">{children}</div>
  );
}

export default function CheckoutStatusPage() {
  return (
    <Suspense fallback={<Shell><p className="text-gray-400">Loading…</p></Shell>}>
      <StatusInner />
    </Suspense>
  );
}
