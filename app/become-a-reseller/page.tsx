import type { Metadata } from "next";
import Link from "next/link";
import ResellerForm from "@/components/reseller/ResellerForm";
import { WHATSAPP_NUMBER } from "@/lib/wcpa-types";

export const metadata: Metadata = {
  title: "Become a Reseller — Earn with Digital Invitations | InviteMart",
  description:
    "Join the InviteMart reseller program. Sell 1,800+ premium digital invitation videos, e-cards and PDF invites under your own brand. No inventory, high margins, instant delivery. Apply free today.",
  alternates: { canonical: "/become-a-reseller" },
};

const STATS = [
  { value: "1,800+", label: "Ready designs" },
  { value: "50,000+", label: "Cards delivered" },
  { value: "4–6 hrs", label: "Turnaround" },
  { value: "0", label: "Inventory needed" },
];

const BENEFITS: { title: string; desc: string; icon: React.ReactNode }[] = [
  { title: "High profit margins", desc: "Buy at special reseller pricing and set your own retail price. Keep the difference on every order.", icon: <><path d="M12 1v22" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></> },
  { title: "1,800+ designs ready", desc: "A huge catalogue of wedding, party and puja invitations — nothing to design from scratch.", icon: <><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" /></> },
  { title: "Zero investment", desc: "No stock, no upfront cost, no joining fee. Start selling the day you sign up.", icon: <><circle cx="12" cy="12" r="9" /><path d="M8 12h8" /></> },
  { title: "White-label ready", desc: "Deliver under your own brand. We stay invisible — your clients see only you.", icon: <><path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z" /><path d="m9 12 2 2 4-4" /></> },
  { title: "Instant digital delivery", desc: "Videos and PDFs delivered in hours — your clients never wait for a printer.", icon: <><path d="M13 2 4.5 12.5a1 1 0 0 0 .8 1.6H11l-1 7.9 8.5-10.5a1 1 0 0 0-.8-1.6H12l1-7.9z" /></> },
  { title: "Dedicated support", desc: "A WhatsApp team helps you with designs, edits and rush orders whenever you need.", icon: <><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></> },
];

const STEPS = [
  { n: "1", title: "Apply free", desc: "Fill the form or message us on WhatsApp." },
  { n: "2", title: "Get reseller access", desc: "Receive special pricing and the full catalogue." },
  { n: "3", title: "Sell & earn", desc: "Take orders from clients at your own price." },
];

const FOR_WHO = [
  { title: "Event & wedding planners", icon: "🎉" },
  { title: "Card & gift shops", icon: "🛍️" },
  { title: "Freelance designers", icon: "🎨" },
  { title: "Social media sellers", icon: "📱" },
];

const FAQS = [
  { q: "Is there a joining fee?", a: "No. Joining the InviteMart reseller program is completely free — no joining fee and no monthly charges. You only pay the reseller price when you place an order for a client." },
  { q: "How much can I earn?", a: "You buy at discounted reseller pricing and sell at your own retail price, so your margin is entirely up to you. Most resellers add a healthy markup on every video or card." },
  { q: "Do I need to keep any stock?", a: "No. Everything is digital and made to order, so there's zero inventory and zero upfront investment." },
  { q: "Can I sell under my own brand?", a: "Yes. Our designs are white-label ready — remove our branding and deliver to your clients as your own." },
  { q: "How do my clients receive their invitation?", a: "We deliver the personalised video or PDF to you (usually in 4–6 working hours), and you share it with your client on WhatsApp, Instagram or email." },
];

export default function BecomeAResellerPage() {
  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    "Hi InviteMart! I'd like to join the reseller program."
  )}`;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 82% 18%, rgba(231,207,159,.5), transparent 45%), radial-gradient(circle at 8% 92%, rgba(168,27,78,.6), transparent 40%)",
          }}
        />
        <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
              ✦ InviteMart Partner Program
            </p>
            <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl">
              Become a Reseller. Start earning today.
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-white/80">
              Sell 1,800+ premium digital invitations under your own brand — with
              high margins, zero inventory and instant delivery.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="#apply"
                className="rounded-full bg-white px-8 py-3.5 font-semibold text-brand-700 transition hover:bg-cream"
              >
                Apply free →
              </Link>
              <a
                href={waHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/30 px-8 py-3.5 font-semibold text-white transition hover:border-gold hover:text-gold-soft"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 text-center md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label}>
              <p className="font-display text-3xl font-extrabold text-brand-700">{s.value}</p>
              <p className="mt-1 text-sm text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Why partner with InviteMart</h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {b.icon}
                </svg>
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{b.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold text-ink">How it works</h2>
            <div className="gold-rule mx-auto mt-4 w-24" />
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="relative rounded-2xl border border-black/5 bg-cream p-7 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-600 font-display text-xl font-bold text-white">
                  {s.n}
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{s.title}</h3>
                <p className="mt-1.5 text-sm text-gray-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who it's for */}
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Perfect for</h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {FOR_WHO.map((f) => (
            <div key={f.title} className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <span className="text-3xl">{f.icon}</span>
              <p className="mt-3 font-medium text-ink">{f.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Apply form */}
      <section id="apply" className="scroll-mt-24 bg-gradient-to-br from-cream to-brand-50/40">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
              Ready to start earning?
            </h2>
            <p className="mt-3 max-w-md text-gray-600">
              Join hundreds of resellers growing their business with InviteMart.
              It&apos;s free to apply and you can start selling the same day.
            </p>
            <ul className="mt-6 space-y-2.5">
              {["Free to join — no joining fee", "Special reseller pricing", "White-label, sell as your own brand", "Setup within 24 hours on WhatsApp"].map((t) => (
                <li key={t} className="flex items-center gap-2.5 text-sm text-gray-700">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="text-brand-600" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
          </div>
          <ResellerForm />
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-4 py-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">Reseller FAQ</h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-black/5 bg-white p-5">
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {f.q}
                <span className="text-gold transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

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
