const STEPS = [
  {
    n: "1",
    icon: "🎨",
    title: "Pick a design",
    desc: "Choose from 1,800+ wedding, party and puja invitation designs.",
  },
  {
    n: "2",
    icon: "✏️",
    title: "Personalise it",
    desc: "Share your names, date and details — we customise it for you.",
  },
  {
    n: "3",
    icon: "💬",
    title: "Share in minutes",
    desc: "Get your video or PDF card and send it instantly on WhatsApp.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-12 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">How it works</h2>
          <p className="mt-2 text-gray-500">
            Your perfect invitation in three simple steps.
          </p>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-black/5 bg-cream p-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-2xl shadow-sm">
                {s.icon}
              </div>
              <span className="absolute right-5 top-5 font-display text-3xl font-bold text-gold/30">
                {s.n}
              </span>
              <h3 className="font-display text-lg font-semibold text-ink">{s.title}</h3>
              <p className="mt-1.5 text-sm text-gray-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
