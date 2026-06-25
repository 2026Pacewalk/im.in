import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "GST Pay Online | InviteMart",
  description:
    "Pay for your InviteMart order online. GST and company details for PACEWALK PRIVATE LIMITED, with secure payment options and GST invoice.",
  alternates: { canonical: "/gst-pay-online" },
  robots: { index: false, follow: true },
};

const COMPANY = [
  ["Legal Name", "PACEWALK PRIVATE LIMITED"],
  ["GST No.", "03AANCP6196Q1ZI"],
  ["PAN No.", "AANCP6196Q"],
];

const PAY = [
  { icon: "💬", title: "Pay via WhatsApp", desc: "Get a payment link & GST invoice instantly.", cta: "Message us", href: "https://wa.me/917307344844?text=Hi%20InviteMart!%20I'd%20like%20to%20pay%20with%20a%20GST%20invoice." },
  { icon: "🅿️", title: "PayPal (International)", desc: "For customers paying from outside India.", cta: "md@pacewalk.com", href: "mailto:md@pacewalk.com" },
  { icon: "🏦", title: "Bank / UPI / Paytm", desc: "View current bank, UPI and Paytm details on our secure page.", cta: "View payment options", href: "https://invitemart.com/pages/gst-pay-online" },
];

export default function GstPayOnlinePage() {
  return (
    <div className="bg-cream pb-16">
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            🧾 Secure Payment
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">GST Pay Online</h1>
          <p className="mx-auto mt-3 max-w-xl text-white/80">
            Pay for your order and receive a GST invoice. Choose any option below.
          </p>
          <div className="gold-rule mx-auto mt-5 w-24 opacity-70" />
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-3xl px-4">
        {/* Company / GST details */}
        <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm md:p-8">
          <h2 className="font-display text-xl font-bold text-ink">Billing details</h2>
          <dl className="mt-4 divide-y divide-gray-100">
            {COMPANY.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-3 text-sm">
                <dt className="text-gray-500">{k}</dt>
                <dd className="font-semibold text-ink">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Payment options */}
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {PAY.map((p) => (
            <div key={p.title} className="flex flex-col rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">{p.icon}</span>
              <h3 className="font-display mt-2 font-bold text-ink">{p.title}</h3>
              <p className="mt-1 flex-1 text-sm text-gray-500">{p.desc}</p>
              <a
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4 text-center text-sm text-gray-600">
          After payment, please share the screenshot on WhatsApp to receive your
          receipt and GST invoice.
        </p>
      </section>
    </div>
  );
}
