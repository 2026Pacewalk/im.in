import type { Metadata } from "next";
import Link from "next/link";
import InvitationMaker from "@/components/ai/InvitationMaker";

export const metadata: Metadata = {
  title: "AI Invitation Maker — Create Invitation Cards Online Free | InviteMart",
  description:
    "Create a beautiful invitation card in seconds with our free AI Invitation Maker. Pick an occasion, add your details, and let AI write and design your wedding, birthday, engagement or housewarming invitation. Download instantly or share on WhatsApp.",
  alternates: { canonical: "/ai-invitation-maker" },
};

const STEPS = [
  { n: "1", title: "Pick your occasion", desc: "Wedding, birthday, engagement, puja and more." },
  { n: "2", title: "Add your details", desc: "Names, date, venue and the tone you like." },
  { n: "3", title: "Generate & share", desc: "AI writes and designs it — download or WhatsApp instantly." },
];

const FAQS = [
  {
    q: "Is the AI Invitation Maker free?",
    a: "Yes. You can generate, preview and download an invitation card for free. Premium animated video invitations and designer-personalised cards are available as paid options.",
  },
  {
    q: "What occasions are supported?",
    a: "Weddings, engagements, birthdays, anniversaries, housewarming (Griha Pravesh), baby showers and puja ceremonies — with multiple writing tones and design themes.",
  },
  {
    q: "Can I edit the wording?",
    a: "Absolutely. Change any detail and hit Regenerate to get fresh AI-written wording, or switch the design theme with a single click.",
  },
  {
    q: "How do I share my invitation?",
    a: "Download it as a high-resolution PNG, or share it directly on WhatsApp. You can also order a premium animated or PDF version from our designers.",
  },
];

export default function AiInvitationMakerPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-16 text-center md:py-20">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
            ✦ New · Powered by AI
          </p>
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
            AI Invitation Maker
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/80">
            Create a stunning, personalised invitation card in seconds. Tell us
            the occasion and a few details — our AI writes the wording and
            designs the card for you. Free to download and share.
          </p>
        </div>
      </section>

      {/* The tool */}
      <section className="mx-auto max-w-7xl px-4 py-12">
        <InvitationMaker />
      </section>

      {/* How it works */}
      <section className="border-t border-black/5 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <h2 className="text-center font-display text-3xl font-bold text-ink">
            How it works
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-black/5 bg-cream p-7 text-center"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">
                  {s.title}
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-bold text-ink">
          Frequently asked questions
        </h2>
        <div className="gold-rule mx-auto mt-4 w-24" />
        <div className="mt-8 space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-black/5 bg-white p-5"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {f.q}
                <span className="text-gray-400 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/shop"
            className="inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Browse premium invitation designs →
          </Link>
        </div>
      </section>

      {/* FAQ structured data for rich results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: FAQS.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />
    </div>
  );
}
