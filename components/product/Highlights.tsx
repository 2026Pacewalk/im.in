// "What's included" highlights — adapts slightly for video vs static cards.
export default function Highlights({ isVideo }: { isVideo: boolean }) {
  const items = isVideo
    ? [
        "Full-HD personalised invitation video",
        "Your names, date, venue & photos added",
        "Background music & elegant animation",
        "Ready to share on WhatsApp, Instagram & email",
        "Unlimited shares — no printing needed",
      ]
    : [
        "High-resolution personalised invitation card",
        "Your names, date, venue & details added",
        "Available as e-Card and print-ready PDF",
        "Ready to share on WhatsApp, Instagram & email",
        "Free design assistance on WhatsApp",
      ];

  return (
    <div className="mt-6 rounded-2xl border border-black/5 bg-cream p-4">
      <h3 className="font-display text-base font-semibold text-ink">
        What you’ll get
      </h3>
      <ul className="mt-2.5 space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex items-start gap-2.5 text-sm text-gray-700">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-brand-600"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
