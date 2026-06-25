import type { Metadata } from "next";
import Link from "next/link";
import { getYoast } from "@/lib/wp";
import { yoastToMetadata } from "@/lib/seo";
import CouponCard, { type Coupon } from "@/components/CouponCard";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const yoast = await getYoast("pages", "discount-offers-coupon-code");
  return yoastToMetadata(yoast, {
    title: "Discount Coupon Codes & Offers | InviteMart",
    description:
      "Save on digital invitations with the latest InviteMart coupon codes and offers. Copy a code and apply it at checkout.",
  });
}

const COUPONS: Coupon[] = [
  {
    code: "HOLI20",
    title: "Holi Offer",
    discount: "20% OFF",
    desc: "Flat 20% off on all categories. Valid for first-time users.",
    status: "active",
    used: "159 people used",
  },
  {
    code: "WELCOME",
    title: "Welcome Offer",
    discount: "10% OFF",
    desc: "Flat 10% off on all products. Perfect for your first order.",
    status: "active",
    used: "1,166 people used",
  },
  {
    code: "MAROFF15",
    title: "Special Offer",
    discount: "15% OFF",
    desc: "Up to 15% off on your orders across all designs.",
    status: "expired",
    used: "650 people used",
  },
  {
    code: "15OFFAUG",
    title: "Independence Day Offer",
    discount: "15% OFF",
    desc: "Flat 15% off on all categories. Valid for all users.",
    status: "expired",
  },
  {
    code: "15OFF15AUG",
    title: "Independence Day 2023",
    discount: "15% OFF",
    desc: "Up to 15% off on your orders.",
    status: "expired",
    used: "19 people used",
  },
];

const STEPS = [
  "Copy the coupon code you want to use.",
  "Browse our designs and add your favourite to the cart.",
  "Apply the coupon code at checkout.",
  "Enjoy your discount and share your invite!",
];

export default function CouponsPage() {
  const active = COUPONS.filter((c) => c.status === "active");
  const expired = COUPONS.filter((c) => c.status === "expired");

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 85% 20%, rgba(231,207,159,.5), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-5xl px-4 py-16 text-center md:py-20">
          <p className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            🎁 Offers & Coupons
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Discount Coupon Codes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Grab the latest InviteMart offers — copy a code and apply it at
            checkout to save on your digital invitations.
          </p>
        </div>
      </section>

      {/* Active coupons */}
      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Available offers
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {active.map((c) => (
            <CouponCard key={c.code} coupon={c} />
          ))}
        </div>

        {expired.length > 0 && (
          <>
            <h3 className="mb-6 mt-14 text-center font-display text-xl font-semibold text-gray-500">
              Past offers
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {expired.map((c) => (
                <CouponCard key={c.code} coupon={c} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* How to redeem */}
      <section className="bg-cream">
        <div className="mx-auto max-w-4xl px-4 py-14">
          <h2 className="text-center font-display text-2xl font-bold text-ink">
            How to redeem a coupon
          </h2>
          <div className="gold-rule mx-auto mt-4 w-20" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2">
            {STEPS.map((s, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700">{s}</span>
              </li>
            ))}
          </ol>
          <div className="mt-10 text-center">
            <Link
              href="/shop"
              className="inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
            >
              Shop &amp; apply your code →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
