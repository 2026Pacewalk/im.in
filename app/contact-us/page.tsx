import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us | InviteMart",
  description:
    "Get in touch with InviteMart for custom digital invitations — call or WhatsApp +91 73073 44844, email hello@invitemart.com, or visit us in Zirakpur, Punjab.",
  alternates: { canonical: "/contact-us" },
};

const CONTACTS = [
  { icon: "🏢", title: "Headquarters", lines: ["SCO-209, Green Lotus Avenue,", "Zirakpur, Punjab 140603"], href: "https://www.google.com/maps/search/?api=1&query=Green+Lotus+Avenue+Zirakpur", cta: "Open in Maps" },
  { icon: "📞", title: "Call / WhatsApp", lines: ["+91 73073 44844"], href: "https://wa.me/917307344844", cta: "Message on WhatsApp" },
  { icon: "✉️", title: "Email", lines: ["hello@invitemart.com"], href: "mailto:hello@invitemart.com", cta: "Send an email" },
];

export default function ContactPage() {
  return (
    <div className="bg-cream pb-16">
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            Keep in touch with us
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Have a question or a custom requirement? Our team replies fast on
            WhatsApp — usually within minutes during working hours.
          </p>
          <div className="gold-rule mx-auto mt-5 w-24 opacity-70" />
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-4xl px-4">
        <div className="grid gap-5 md:grid-cols-3">
          {CONTACTS.map((c) => (
            <div key={c.title} className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm">
              <span className="text-3xl">{c.icon}</span>
              <h2 className="font-display mt-3 text-lg font-bold text-ink">{c.title}</h2>
              <div className="mt-2 flex-1 text-sm text-gray-600">
                {c.lines.map((l) => <p key={l}>{l}</p>)}
              </div>
              <a
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                {c.cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl bg-ink p-8 text-center text-white">
          <h2 className="font-display text-2xl font-bold">Ready to create your invitation?</h2>
          <p className="mt-2 text-white/80">
            Browse 1,800+ designs or generate one free with our AI maker.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <a href="https://wa.me/917307344844?text=Hi%20InviteMart!%20I'd%20like%20a%20custom%20invitation." target="_blank" rel="noopener noreferrer" className="rounded-full bg-[#25D366] px-7 py-3 font-semibold text-white transition hover:brightness-95">
              WhatsApp us
            </a>
            <a href="/shop" className="rounded-full bg-white px-7 py-3 font-semibold text-brand-700 transition hover:bg-cream">
              Browse designs
            </a>
          </div>
          <p className="mt-4 text-xs text-white/50">Working hours: Mon–Sat, 10:00 AM – 6:30 PM IST</p>
        </div>
      </section>
    </div>
  );
}
