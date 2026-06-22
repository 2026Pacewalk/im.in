import { SITE } from "@/lib/wp";

const REVIEWS = [
  {
    name: "Priya S.",
    city: "Jaipur",
    text: "The wedding invitation video was stunning and delivered in just a few hours. Everyone on WhatsApp loved it!",
  },
  {
    name: "Rahul M.",
    city: "Pune",
    text: "Super easy to personalise and the team helped me on WhatsApp. Got my Griha Pravesh card exactly how I wanted.",
  },
  {
    name: "Aisha K.",
    city: "Hyderabad",
    text: "Beautiful designs at a great price. Used it for my daughter's first birthday — quick, simple and elegant.",
  },
  {
    name: "Vikram R.",
    city: "Delhi",
    text: "Ordered an engagement e-card late at night and still got it the same day. Brilliant service.",
  },
];

function Stars() {
  return (
    <span className="text-amber-400" aria-hidden>
      ★★★★★
    </span>
  );
}

export default function Testimonials() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "InviteMart Digital Invitations",
    url: SITE,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "1280",
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: r.text,
    })),
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-16">
      <div className="mb-10 text-center">
        <h2 className="font-display text-3xl font-bold text-ink">
          Loved by 50,000+ happy customers
        </h2>
        <div className="mt-2 flex items-center justify-center gap-2 text-sm text-gray-500">
          <Stars /> <span className="font-medium text-ink">4.9 / 5</span> · 1,280+ reviews
        </div>
        <div className="gold-rule mx-auto mt-4 w-24" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="flex flex-col rounded-2xl border border-black/5 bg-white p-6 shadow-sm"
          >
            <Stars />
            <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-gray-600">
              “{r.text}”
            </blockquote>
            <figcaption className="mt-4 text-sm font-semibold text-ink">
              {r.name}
              <span className="font-normal text-gray-400"> · {r.city}</span>
            </figcaption>
          </figure>
        ))}
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
