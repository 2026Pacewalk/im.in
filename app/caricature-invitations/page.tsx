import type { Metadata } from "next";
import Link from "next/link";
import { getProducts } from "@/lib/wp";
import ProductCard from "@/components/ProductCard";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Caricature Wedding Invitations & Videos — Personalised | InviteMart",
  description:
    "Fun, personalised caricature wedding invitations and videos featuring you and your partner. Choose a design, add your details and share — digital caricature invites for weddings, engagements and more.",
  alternates: { canonical: "/caricature-invitations" },
};

const PERKS = [
  ["🎨", "Custom couple caricatures", "Cartoon versions of you and your partner."],
  ["🎬", "Card or animated video", "Choose a still e-card or a lively video invite."],
  ["✏️", "Fully personalised", "Names, outfits, theme, date and venue."],
  ["📱", "Share anywhere", "WhatsApp, Instagram and email ready."],
];

export default async function CaricatureInvitationsPage() {
  const { items } = await getProducts({
    category: "caricature-wedding-invitation",
    perPage: 15,
    orderby: "popularity",
    order: "desc",
  }).catch(() => ({ items: [] as Awaited<ReturnType<typeof getProducts>>["items"] }));

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            🎨 Caricature Invitations
          </p>
          <h1 className="font-display text-4xl font-bold md:text-5xl">
            Caricature Wedding Invitations
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">
            Turn your love story into art. Personalised caricature invitation
            cards and videos that make your guests smile before they even RSVP.
          </p>
          <Link
            href="#designs"
            className="mt-6 inline-block rounded-full bg-white px-7 py-3 font-semibold text-brand-700 transition hover:bg-cream"
          >
            See caricature designs →
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {PERKS.map(([icon, t, d]) => (
            <div key={t} className="rounded-2xl border border-black/5 bg-white p-5 text-center shadow-sm">
              <span className="text-3xl">{icon}</span>
              <p className="font-display mt-2 font-bold text-ink">{t}</p>
              <p className="mt-1 text-sm text-gray-500">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="designs" className="mx-auto max-w-7xl px-4 pb-16">
        <div className="mb-8 text-center">
          <h2 className="font-display text-3xl font-bold text-ink">
            Popular caricature designs
          </h2>
          <div className="gold-rule mx-auto mt-4 w-24" />
        </div>
        {items.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {items.map((p) => (
              <ProductCard
                key={p.id}
                product={{
                  id: p.id,
                  name: p.name,
                  slug: p.slug,
                  prices: p.prices,
                  images: p.images,
                  on_sale: p.on_sale,
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            Browse all designs in our{" "}
            <Link href="/shop?q=caricature" className="font-semibold text-brand-600">
              caricature collection →
            </Link>
          </p>
        )}
        <div className="mt-10 text-center">
          <Link
            href="/shop?q=caricature"
            className="inline-block rounded-full bg-brand-600 px-8 py-3 font-semibold text-white transition hover:bg-brand-700"
          >
            View all caricature invitations →
          </Link>
        </div>
      </section>
    </div>
  );
}
