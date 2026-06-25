import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | InviteMart",
  description:
    "Answers about creating digital invitations at InviteMart — formats, sizes, customization, delivery time, revisions and watermark removal.",
  alternates: { canonical: "/faq" },
};

const FAQS = [
  { q: "What kind of invites can I create at InviteMart?", a: "We offer custom digital invitations for any occasion. You can make single-page, multi-page or animated video invites — in regional languages too." },
  { q: "What will be the size of the digital invitation?", a: "The standard size is W-1080 × H-1920 and W-1080 × H-2280 pixels. We can also make any custom size as per your requirement." },
  { q: "How do I make a digital invitation video / eCard online?", a: "Choose a template, add it to cart, provide your details, make payment, and get your eCard in 4–6 working hours. That's it!" },
  { q: "How is the digital invitation customized?", a: "Our professional designers edit and customize your invitation. After your order, our team contacts you via call or WhatsApp to understand your requirements." },
  { q: "What content should the digital invitation include?", a: "We share a content format for you to fill and send back. You can also tell us any extra content you'd like added." },
  { q: "What format will I get?", a: "eCard invitations are delivered as JPEG or PDF; video invitations as MP4 in HD and SD versions." },
  { q: "Can I review my invitation before it's finalized?", a: "Yes — we share the draft on your WhatsApp or email, with unlimited revisions until you're happy." },
  { q: "When can I expect my invitation?", a: "eCard (JPEG/PDF) within 4–6 working hours; caricature/video within 24 working hours (excluding weekends & holidays). Office hours: 10:00 AM–6:30 PM, Mon–Sat." },
  { q: "Will you remove the watermark?", a: "The final invite has no center watermark. A small “Designed by InviteMart” mark appears at the bottom-right; it can be removed for ₹299." },
];

export default function FaqPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="bg-cream pb-16">
      <section className="bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            We&apos;re here to help
          </p>
          <h1 className="font-display text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h1>
          <div className="gold-rule mx-auto mt-5 w-24 opacity-70" />
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-3xl px-4">
        <div className="space-y-3">
          {FAQS.map((f) => (
            <details
              key={f.q}
              className="group rounded-2xl border border-black/5 bg-white p-5 shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {f.q}
                <span className="ml-4 shrink-0 text-brand-600 transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/contact-us"
            className="inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            Still have a question? Contact us →
          </Link>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </div>
  );
}
