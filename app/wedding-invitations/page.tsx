import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Wedding Invitations by Community & Language — Hindu, Punjabi, Marwari & more | InviteMart",
  description:
    "Browse digital wedding invitation cards and videos by community and language — Hindu, Punjabi/Sikh, Marwari, Rajasthani, Marathi, Bengali, South Indian, Muslim, Christian and Jain. Personalised and ready to share.",
  alternates: { canonical: "/wedding-invitations" },
};

const COMMUNITIES = [
  { label: "Hindu Wedding", href: "/product-category/religion/hindu-wedding-invitation", emoji: "🕉️", bg: "from-brand-600 to-brand-800" },
  { label: "Punjabi / Sikh", href: "/product-category/religion/punjabi-wedding-invitation", emoji: "🪯", bg: "from-amber-600 to-brand-700" },
  { label: "Marwari", href: "/product-category/religion/marwari-wedding-invitation", emoji: "👑", bg: "from-rose-600 to-brand-800" },
  { label: "Rajasthani", href: "/product-category/religion/rajasthani-wedding-invitation", emoji: "🏰", bg: "from-orange-600 to-brand-800" },
  { label: "Marathi", href: "/product-category/religion/marathi-wedding-invitation", emoji: "🌺", bg: "from-pink-600 to-brand-800" },
  { label: "Bengali", href: "/product-category/religion/bengali-wedding-invitation", emoji: "🎎", bg: "from-red-600 to-brand-800" },
  { label: "South Indian", href: "/product-category/religion/south-indian-wedding-invitation", emoji: "🪔", bg: "from-yellow-600 to-brand-800" },
  { label: "Muslim", href: "/product-category/religion/muslim-wedding-invitation", emoji: "🌙", bg: "from-emerald-700 to-ink" },
  { label: "Christian", href: "/product-category/religion/christian-wedding-invitation", emoji: "⛪", bg: "from-indigo-700 to-ink" },
  { label: "Jain", href: "/product-category/religion/jain-wedding-invitation", emoji: "🙏", bg: "from-teal-700 to-brand-800" },
];

export default function WeddingInvitationsHub() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            💍 Wedding Invitations
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Wedding invitations for every community
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Beautifully crafted digital wedding invitation cards and videos,
            tailored to your traditions, language and rituals — ready to
            personalise and share on WhatsApp.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Browse by community &amp; language
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {COMMUNITIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={`group flex aspect-square flex-col items-center justify-center gap-2 rounded-2xl bg-gradient-to-br ${c.bg} p-4 text-center text-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg`}
            >
              <span className="text-4xl drop-shadow">{c.emoji}</span>
              <span className="font-display text-base font-semibold drop-shadow">
                {c.label}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          <Link href="/product-category/video-invitation/wedding-invitation-video" className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
            <span className="text-2xl">🎬</span>
            <p className="font-display mt-2 font-bold text-ink">Wedding Video Invitations</p>
            <p className="mt-1 text-sm text-gray-500">Animated invites with music &amp; photos</p>
          </Link>
          <Link href="/product-category/pdf-invitation-card" className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
            <span className="text-2xl">📄</span>
            <p className="font-display mt-2 font-bold text-ink">Wedding PDF Cards</p>
            <p className="mt-1 text-sm text-gray-500">Printable &amp; clickable PDF invitations</p>
          </Link>
          <Link href="/caricature-invitations" className="rounded-2xl border border-black/5 bg-white p-6 text-center shadow-sm transition hover:shadow-md">
            <span className="text-2xl">🎨</span>
            <p className="font-display mt-2 font-bold text-ink">Caricature Invitations</p>
            <p className="mt-1 text-sm text-gray-500">Fun, personalised couple caricatures</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
