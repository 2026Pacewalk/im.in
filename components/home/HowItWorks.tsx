const STEPS = [
  { n: "1", icon: "👆", title: "Select the Design" },
  { n: "2", icon: "🛒", title: "Add to Cart" },
  { n: "3", icon: "📝", title: "Provide the Details" },
  { n: "4", icon: "💵", title: "Make Payment" },
  { n: "5", icon: "📩", title: "Get eCard in 4–6 working hours" },
];

const VIDEO_URL = "https://www.youtube.com/watch?v=cJbpdlYLQrI";

export default function HowItWorks() {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-ink md:text-4xl">
            How to make a digital invitation online?
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>

        <ol className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="relative flex flex-col items-center rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand-600 px-3 py-0.5 text-xs font-bold text-white">
                Step {s.n}
              </span>
              <span className="mt-3 text-4xl">{s.icon}</span>
              <h3 className="mt-3 font-display text-base font-semibold leading-snug text-ink">
                {s.title}
              </h3>
            </li>
          ))}
        </ol>

        <div className="mt-10 text-center">
          <a
            href={VIDEO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
            View Process
          </a>
        </div>
      </div>
    </section>
  );
}
