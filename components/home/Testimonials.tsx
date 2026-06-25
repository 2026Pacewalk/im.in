import { SITE } from "@/lib/wp";

const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=InviteMART+Digital+Invitation+Maker";

const REVIEWS: { name: string; text: string }[] = [
  {
    name: "Ayesha Patnaik",
    text: "Beautiful templates. Very quick and efficient work. Really handy team. Made changes in a blink. Cheers to the team",
  },
  {
    name: "Vijaylakshmi Dikle",
    text: "InviteMart has a great collection for all categories of events. I personally loved how easy it was to find what I needed on their website. I got my wedding invitation made from them, and I have to say that they have a very amazing, efficient, sweet and cooperative staff who helped me with every detail i needed. All my best wishes for future endeavours to the team.",
  },
  {
    name: "Ankit Gupta",
    text: "I got my wedding video invite(s) done by Invitemart which were completely customised and exactly as per my wish. They were quite accommodating to hear my requirement, understand that and deliver on priority. Also, I asked for many updates/different options which they were kind enough to provide no matter how many times I asked for. 5 stars are not just enough to rate their excellent services. Recommended for all. A ton thanks to @Shekhar and team!",
  },
  {
    name: "ankur rohilla",
    text: "Amazing experience. They worked very closely with us ensuring the output is exactly the way we wanted it to be. Loved the work and effort! Kudos to Gurmeet..",
  },
  {
    name: "Arisha Chauhan",
    text: "It's was a wonderful service…. Card was made totally according to my expectations and a very fast service. Really loved the work.",
  },
  {
    name: "Satish Dubey",
    text: "Amazing experience dealing with invite mart, within 1 hr job was done. Will always recommend to take help from this company..",
  },
  {
    name: "Prathiba Nadar",
    text: "Genuinely I loved the work your team had done for my sister in laws half saree function.. helped me with my multiple corrections and quick responses.. thank you 😊",
  },
  {
    name: "Mandeep Maan",
    text: "They are really professional and they will also provide you preview details before getting money first. And I really appreciate this gesture. Highly recommended 😊",
  },
  {
    name: "Srinivas Dronamraju",
    text: "I got a half saree function invite done by InviteMart. Excellent work and lot of patience. Didn't realise that getting the invites done will be so easy. Thanks to Sandeep from InviteMart for making things a cake walk.",
  },
  {
    name: "L. Ashok Kumar",
    text: "Very good response. Each and every correction you do it very quickly. Very quick reply from you — thanks a lot for a kind response.",
  },
];

function Stars() {
  return (
    <span className="text-amber-400" aria-hidden>
      ★★★★★
    </span>
  );
}

function GoogleG({ size = 44 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34A21.99 21.99 0 002 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
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
      ratingValue: "5.0",
      reviewCount: "643",
    },
    review: REVIEWS.map((r) => ({
      "@type": "Review",
      author: { "@type": "Person", name: r.name },
      reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
      reviewBody: r.text,
    })),
  };

  return (
    <section className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
            Why everyone <span className="align-middle">❤️</span> digital invites
          </h2>
          <p className="mt-2 text-xl">
            <span className="font-extrabold text-brand-600">50k+</span>{" "}
            <span className="font-semibold text-ink">Happy Customers</span>
          </p>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-3">
          {/* Left: brand + Google rating */}
          <div className="lg:col-span-1">
            <h3 className="font-display text-2xl font-bold text-ink">InviteMart</h3>
            <p className="font-semibold text-brand-600">Since 2021</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              The most trusted name for all your digital invitation needs. We
              take pride in delivering work that leaves customers fully
              satisfied — don&apos;t just take our word for it, check out our
              reviews on Google!
            </p>
            <div className="mt-6 flex items-center gap-4">
              <GoogleG />
              <div>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-extrabold leading-none text-ink">5.0</span>
                  <span className="mb-1 text-gray-400">/5</span>
                </div>
                <div className="mt-1 flex items-center gap-2">
                  <Stars />
                  <span className="text-sm font-medium text-gray-600">643 Reviews</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: scrollable reviews */}
          <div className="lg:col-span-2">
            <div className="no-scrollbar max-h-[28rem] space-y-4 overflow-y-auto pr-1">
              {REVIEWS.map((r) => (
                <figure
                  key={r.name}
                  className="rounded-2xl border border-black/5 bg-cream p-5 shadow-sm"
                >
                  <blockquote className="text-sm leading-relaxed text-gray-700">
                    {r.text}
                  </blockquote>
                  <figcaption className="mt-3 flex items-center justify-between">
                    <span>
                      <span className="block font-semibold text-ink">{r.name}</span>
                      <Stars />
                    </span>
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <GoogleG size={16} /> Google review
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 text-center">
          <a
            href={GOOGLE_REVIEWS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            Check out more reviews
          </a>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
