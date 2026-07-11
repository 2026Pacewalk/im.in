import Link from "next/link";
import { decode } from "@/lib/format";
import type { StoreCategory } from "@/lib/store-types";

/* ---------- vector icon set (line-art, uses currentColor) ---------- */
const PATHS: Record<string, React.ReactNode> = {
  wedding: (
    <>
      <circle cx="9" cy="14.5" r="5" />
      <circle cx="15.5" cy="14.5" r="5" />
      <path d="M12 4.5l1.8 2.2h-3.6z" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="6" width="13" height="12" rx="2.5" />
      <path d="M16 10.5l5-2.5v8l-5-2.5z" />
      <path d="M8 12l3 2-3 2z" />
    </>
  ),
  card: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="M3.5 7.5l8.5 5.5 8.5-5.5" />
    </>
  ),
  baby: (
    <>
      <path d="M12 3c3 0 5.2 2.3 5.2 5.2 0 3.4-2.6 6.4-5.2 8-2.6-1.6-5.2-4.6-5.2-8C6.8 5.3 9 3 12 3z" />
      <path d="M12 16.5V20" />
      <circle cx="10" cy="8" r=".6" fill="currentColor" />
      <circle cx="14" cy="8" r=".6" fill="currentColor" />
      <path d="M10.5 10.5c.9.7 2.1.7 3 0" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M12 17.5c-1.6-1.1-3-2.1-3-3.5 0-.9.7-1.5 1.5-1.5.6 0 1.1.3 1.5.9.4-.6.9-.9 1.5-.9.8 0 1.5.6 1.5 1.5 0 1.4-1.4 2.4-3 3.5z" />
    </>
  ),
  diya: (
    <>
      <path d="M12 3.5c1.1 1.9 2 3 2 4.4A2 2 0 0112 10a2 2 0 01-2-2.1c0-1.4.9-2.5 2-4.4z" />
      <path d="M3.5 13c2.3 2.2 5.4 3.3 8.5 3.3s6.2-1.1 8.5-3.3c-1.1 3.3-4.6 5.5-8.5 5.5s-7.4-2.2-8.5-5.5z" />
    </>
  ),
  party: (
    <>
      <path d="M8 3a3.4 3.4 0 013.4 3.4C11.4 9 8 11.8 8 11.8S4.6 9 4.6 6.4A3.4 3.4 0 018 3z" />
      <path d="M8 11.8V15" />
      <path d="M16 6a3 3 0 013 3c0 2.3-3 4.6-3 4.6S13 11.3 13 9a3 3 0 013-3z" />
      <path d="M16 13.6V17" />
    </>
  ),
  ring: (
    <>
      <circle cx="12" cy="15" r="5" />
      <path d="M9.5 8l2.5-3 2.5 3-2.5 2.8z" />
    </>
  ),
  doc: (
    <>
      <path d="M6.5 3h6l5 5v13h-11z" />
      <path d="M12.5 3v5h5" />
      <path d="M9 13h6M9 16.5h6" />
    </>
  ),
  sparkle: (
    <>
      <path d="M12 3l1.7 4.9L18.5 9l-4.8 1.7L12 15.5l-1.7-4.8L5.5 9l4.8-1.6z" />
      <path d="M18 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" />
    </>
  ),
};

function iconKey(name: string): keyof typeof PATHS {
  const s = name.toLowerCase();
  if (/video|reel|animat/.test(s)) return "video";
  if (/wedding|shaadi|marriage|lagna|marwadi|dulha|bride/.test(s)) return "wedding";
  if (/pdf|clickable/.test(s)) return "doc";
  if (/ecard|e-card|greeting|\bcard\b/.test(s)) return "card";
  if (/baby|kids|child|birthday|shower|naming|annaprashan|cradle|mundan|first/.test(s)) return "baby";
  if (/save.*the.*date|countdown|date/.test(s)) return "calendar";
  if (/religio|puja|pooja|mata|ganpati|ganesh|festival|diwali|navratri|jagran|chowki|bhagwat|katha|hindu|god|devi|durga|akhand/.test(s)) return "diya";
  if (/party|cocktail|sangeet|reception|anniversary|haldi|mehndi|mehendi|engage/.test(s)) return "party";
  if (/ring|roka|engagement|proposal/.test(s)) return "ring";
  return "sparkle";
}

function Icon({ name, className }: { name: keyof typeof PATHS; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

const GRADIENTS = [
  "from-brand-600 via-brand-700 to-brand-900",
  "from-[#8a1a44] via-brand-800 to-ink",
  "from-rose-600 via-brand-700 to-brand-900",
  "from-brand-700 via-[#5c1230] to-ink",
];

export default function OccasionGrid({ categories }: { categories: StoreCategory[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {categories.map((c, i) => {
        const key = iconKey(c.name);
        return (
          <Link
            key={c.id}
            href={`/product-category/${c.slug}`}
            className={`group relative flex min-h-[170px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1.5 hover:shadow-xl ${GRADIENTS[i % GRADIENTS.length]}`}
          >
            {/* soft gold glow */}
            <span className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-gold/20 blur-2xl" />
            {/* big watermark vector */}
            <Icon
              name={key}
              className="pointer-events-none absolute -bottom-6 -right-5 h-36 w-36 text-white/10 transition duration-500 group-hover:rotate-6 group-hover:scale-110"
            />
            {/* dotted texture */}
            <svg className="pointer-events-none absolute right-4 top-3 h-10 w-10 text-white/15" aria-hidden="true">
              <pattern id={`d${i}`} width="7" height="7" patternUnits="userSpaceOnUse">
                <circle cx="1.5" cy="1.5" r="1" fill="currentColor" />
              </pattern>
              <rect width="40" height="40" fill={`url(#d${i})`} />
            </svg>

            {/* icon chip */}
            <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-gold-soft ring-1 ring-white/25 backdrop-blur-sm transition group-hover:bg-white/25">
              <Icon name={key} className="h-6 w-6" />
            </span>

            <div className="relative">
              <h3 className="font-display text-base font-bold leading-tight drop-shadow-sm">
                {decode(c.name)}
              </h3>
              <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[11px] font-medium text-white/90 ring-1 ring-white/15">
                {c.count} designs
                <svg className="h-3 w-3 transition group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
