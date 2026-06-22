const FAQS = [
  {
    q: "How do I create a digital invitation?",
    a: "Pick a design, share your event details (names, date, venue), and we personalise it for you. You'll receive your video or PDF invitation ready to share — usually within a few hours.",
  },
  {
    q: "What types of invitations do you offer?",
    a: "Wedding invitation videos, e-cards, PDF invitations, and designs for engagements, birthdays, anniversaries, housewarming (Griha Pravesh), baby showers and puja ceremonies — 1,800+ designs in total.",
  },
  {
    q: "How fast will I get my invitation?",
    a: "Most digital cards are delivered within 4–6 working hours after your details are confirmed. e-Cards are often even quicker.",
  },
  {
    q: "Can I personalise the design and language?",
    a: "Yes. You can customise names, dates, venue, photos, colours and even the language (Hindi, English and regional Indian languages) on most designs.",
  },
  {
    q: "How do I share my invitation?",
    a: "Your invitation is optimised for WhatsApp, Instagram and email. Just download and share — no app or printing needed.",
  },
];

export default function HomeFaq() {
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
    <section className="mx-auto max-w-3xl px-4 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">
          Frequently asked questions
        </h2>
        <div className="gold-rule mx-auto mt-4 w-24" />
      </div>

      <div className="space-y-3">
        {FAQS.map((f) => (
          <details
            key={f.q}
            className="group rounded-2xl border border-black/5 bg-white p-5"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
              {f.q}
              <span className="text-gold transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{f.a}</p>
          </details>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
