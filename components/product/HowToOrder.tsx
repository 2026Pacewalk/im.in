const STEPS = [
  { title: "Choose a design", desc: "Pick your favourite from 1,800+ designs.", icon: "ti-click" },
  { title: "Add your details", desc: "Share names, date, venue and photos.", icon: "ti-edit" },
  { title: "We personalise it", desc: "Our designers craft your card.", icon: "ti-palette" },
  { title: "Pay securely", desc: "Quick & safe online payment.", icon: "ti-lock" },
  { title: "Get it in 4–6 hrs", desc: "Download & share on WhatsApp.", icon: "ti-send" },
];

const ICON: Record<string, React.ReactNode> = {
  "ti-click": <><path d="M9 11.5V5a2 2 0 0 1 4 0v6" /><path d="M13 11V8a2 2 0 0 1 4 0v3" /><path d="M17 11.5V9a2 2 0 0 1 4 0v6a6 6 0 0 1-6 6h-2a7 7 0 0 1-5-3l-2.5-3.5a2 2 0 0 1 3-2.5L9 12" /></>,
  "ti-edit": <><path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" /><path d="M13.5 6.5l3 3" /></>,
  "ti-palette": <><circle cx="12" cy="12" r="9" /><circle cx="7.5" cy="10.5" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="16.5" cy="10.5" r="1" /><path d="M12 21a3 3 0 0 0 0-6 2 2 0 0 1-2-2 2 2 0 0 0-2-2" /></>,
  "ti-lock": <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
  "ti-send": <><path d="m22 2-7 20-4-9-9-4 20-7z" /><path d="M22 2 11 13" /></>,
};

export default function HowToOrder() {
  return (
    <section className="mt-16 border-t border-black/5 pt-10">
      <h2 className="font-display text-2xl font-bold text-ink">How to order</h2>
      <div className="gold-rule mt-3 w-16" />

      <ol className="relative mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
        {/* connecting line on desktop */}
        <span className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent lg:block" />
        {STEPS.map((s, i) => (
          <li key={s.title} className="relative flex flex-col items-center text-center">
            <span className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-gold/30 bg-white text-brand-600 shadow-sm">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICON[s.icon]}
              </svg>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-600 text-[11px] font-bold text-white">
                {i + 1}
              </span>
            </span>
            <h3 className="mt-3 font-display text-base font-semibold text-ink">{s.title}</h3>
            <p className="mt-1 text-sm text-gray-500">{s.desc}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
