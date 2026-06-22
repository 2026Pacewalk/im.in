const BADGES: { title: string; sub: string; icon: React.ReactNode }[] = [
  {
    title: "Instant delivery",
    sub: "Digital card in 4–6 hrs",
    icon: (
      <path d="M13 2 4.5 12.5a1 1 0 0 0 .8 1.6H11l-1 7.9 8.5-10.5a1 1 0 0 0-.8-1.6H12l1-7.9z" />
    ),
  },
  {
    title: "Fully personalised",
    sub: "Names, photos & details",
    icon: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
      </>
    ),
  },
  {
    title: "WhatsApp support",
    sub: "Help from our designers",
    icon: (
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5z" />
    ),
  },
  {
    title: "Secure checkout",
    sub: "Safe & private payment",
    icon: (
      <>
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </>
    ),
  },
];

export default function TrustBadges() {
  return (
    <div className="mt-6 grid grid-cols-2 gap-2.5">
      {BADGES.map((b) => (
        <div
          key={b.title}
          className="flex items-center gap-2.5 rounded-xl border border-black/5 bg-white p-3 shadow-sm"
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {b.icon}
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-ink">{b.title}</span>
            <span className="block text-xs text-gray-500">{b.sub}</span>
          </span>
        </div>
      ))}
    </div>
  );
}
