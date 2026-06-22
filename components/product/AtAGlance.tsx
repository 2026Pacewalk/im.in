const ICONS: Record<string, React.ReactNode> = {
  format: <><rect x="3" y="4" width="18" height="14" rx="2" /><path d="m9 9 5 3-5 3V9z" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" /></>,
  share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.6 13.5 6.8 4M15.4 6.5l-6.8 4" /></>,
};

export default function AtAGlance({ isVideo }: { isVideo: boolean }) {
  const rows = [
    { icon: "format", label: "Format", value: isVideo ? "Full-HD video" : "e-Card & print PDF" },
    { icon: "clock", label: "Delivery", value: "4–6 working hours" },
    { icon: "user", label: "Personalised", value: "Names, photos, date" },
    { icon: "globe", label: "Languages", value: "English + regional" },
    { icon: "share", label: "Share via", value: "WhatsApp, Insta, email" },
  ];

  return (
    <aside className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm lg:sticky lg:top-24">
      <h3 className="font-display text-lg font-semibold text-ink">At a glance</h3>
      <div className="gold-rule mt-3 w-12" />
      <dl className="mt-4 space-y-3.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                {ICONS[r.icon]}
              </svg>
            </span>
            <span className="leading-tight">
              <dt className="text-xs uppercase tracking-wide text-gray-400">{r.label}</dt>
              <dd className="text-sm font-medium text-ink">{r.value}</dd>
            </span>
          </div>
        ))}
      </dl>
    </aside>
  );
}
