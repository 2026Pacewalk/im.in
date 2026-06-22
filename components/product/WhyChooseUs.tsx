const REASONS: { title: string; desc: string; icon: React.ReactNode }[] = [
  {
    title: "Stunning first impression",
    desc: "Beautiful, modern designs that wow your guests the moment they open it.",
    icon: <><path d="M12 3l2.5 5 5.5.8-4 3.9.9 5.5L12 16.5 7.1 18.2l.9-5.5-4-3.9 5.5-.8L12 3z" /></>,
  },
  {
    title: "Fully personalised",
    desc: "Your names, photos, date and venue — tell your story your way.",
    icon: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  },
  {
    title: "Eco-friendly & paperless",
    desc: "A greener alternative to printed cards. Save trees, share digitally.",
    icon: <><path d="M5 21c10 0 16-6 16-16-9 0-16 4-16 12" /><path d="M5 21c0-5 3-9 8-11" /></>,
  },
  {
    title: "Delivered in 4–6 hours",
    desc: "No waiting for the printer. Get your card the same day and share instantly.",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  },
  {
    title: "Save money & time",
    desc: "A fraction of the cost of printed invites, with zero hassle.",
    icon: <><circle cx="12" cy="12" r="9" /><path d="M12 7v10M9.5 9.5a2.5 2 0 0 1 5 0c0 2.5-5 1.5-5 4a2.5 2 0 0 0 5 0" /></>,
  },
  {
    title: "Share with one click",
    desc: "Send to all your friends and family on WhatsApp, Instagram & email.",
    icon: <><path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" /></>,
  },
];

export default function WhyChooseUs() {
  return (
    <section className="mt-16 border-t border-black/5 pt-10">
      <h2 className="font-display text-2xl font-bold text-ink">Why choose InviteMart</h2>
      <div className="gold-rule mt-3 w-16" />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((r) => (
          <div
            key={r.title}
            className="group rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600 transition group-hover:bg-brand-600 group-hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {r.icon}
              </svg>
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-ink">{r.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-gray-500">{r.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
