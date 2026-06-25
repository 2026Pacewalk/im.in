import type { Metadata } from "next";
import Link from "next/link";
import FestivalMaker from "@/components/ai/FestivalMaker";

export const metadata: Metadata = {
  title:
    "Free Festival AI Invitation & Wishes Maker — No Signup | InviteMart",
  description:
    "Create and share beautiful festival wishes for Diwali, Holi, Eid, Christmas, New Year, Raksha Bandhan and 20+ festivals — free, instant, no signup or credit card required. Personalise, choose a design and download or share on WhatsApp.",
  alternates: { canonical: "/free-festival-invitations" },
};

const BADGES = [
  ["🆓", "100% Free"],
  ["⚡", "Instant — no signup"],
  ["💳", "No credit card"],
  ["📱", "Share on WhatsApp"],
];

export default function FreeFestivalInvitationsPage() {
  return (
    <div className="pb-16">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(231,207,159,.5), transparent 45%)",
          }}
        />
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center md:py-18">
          <p className="mb-3 inline-block text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            ✦ Free Festival AI Maker
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-5xl">
            Free Festival Invitations &amp; Wishes
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Pick a festival, personalise it, choose a design and share — all in
            seconds. No signup, no credit card, completely free.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            {BADGES.map(([icon, label]) => (
              <span
                key={label}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm"
              >
                {icon} {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Maker */}
      <section className="py-12">
        <FestivalMaker />
      </section>

      {/* Upsell */}
      <section className="mx-auto max-w-4xl px-4">
        <div className="rounded-3xl border border-black/5 bg-cream p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-ink">
            Want a premium animated festival video?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-gray-600">
            Upgrade to a designer-made animated or PDF festival invitation with
            music, your photos and full personalisation.
          </p>
          <Link
            href="/product-category/festival-wishes"
            className="mt-5 inline-block rounded-full bg-brand-600 px-7 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Explore premium festival designs →
          </Link>
        </div>
      </section>
    </div>
  );
}
