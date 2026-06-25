import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import InvitationMaker from "@/components/ai/InvitationMaker";
import { OCCASIONS, type OccasionId } from "@/lib/ai-invite";

export const revalidate = 3600;

const CONTENT: Record<
  OccasionId,
  { title: string; tagline: string; blurb: string }
> = {
  wedding: {
    title: "Free AI Wedding Invitation Maker",
    tagline: "Create a stunning wedding invitation in seconds",
    blurb:
      "Generate elegant, traditional or modern wedding invitation wording with AI — in English or Hindi. Add your names, date and venue, pick a design, and download or share on WhatsApp instantly.",
  },
  engagement: {
    title: "Free AI Engagement Invitation Maker",
    tagline: "Announce your engagement beautifully",
    blurb:
      "Craft the perfect ring-ceremony invitation with AI-written wording. Personalise it, choose a theme, and share with family and friends in minutes — free.",
  },
  birthday: {
    title: "Free AI Birthday Invitation Maker",
    tagline: "Throw the party — we'll write the invite",
    blurb:
      "Make a fun, playful or elegant birthday invitation in seconds. Add the details, let AI do the wording, and share instantly on WhatsApp.",
  },
  anniversary: {
    title: "Free AI Anniversary Invitation Maker",
    tagline: "Celebrate years of togetherness",
    blurb:
      "Create a heartfelt anniversary invitation with AI. Pick a tone, personalise the details, and download a beautiful card to share.",
  },
  housewarming: {
    title: "Free AI Housewarming (Griha Pravesh) Invitation Maker",
    tagline: "Invite loved ones to your new home",
    blurb:
      "Generate a warm Griha Pravesh / housewarming invitation with AI — traditional or modern, in English or Hindi. Personalise, design and share for free.",
  },
  "baby-shower": {
    title: "Free AI Baby Shower (Godh Bharai) Invitation Maker",
    tagline: "Welcome the little one in style",
    blurb:
      "Create a sweet baby shower or Godh Bharai invitation in seconds with AI. Add your details, choose a design, and share instantly.",
  },
  puja: {
    title: "Free AI Puja & Ceremony Invitation Maker",
    tagline: "Seek blessings with a beautiful invite",
    blurb:
      "Generate devotional puja and ceremony invitations with AI — Mata Ki Chowki, Satyanarayan, Jagran and more. Personalise and share on WhatsApp, free.",
  },
};

export function generateStaticParams() {
  return OCCASIONS.map((o) => ({ occasion: o.id }));
}

export async function generateMetadata(
  props: PageProps<"/ai-invitation-maker/[occasion]">
): Promise<Metadata> {
  const { occasion } = await props.params;
  const c = CONTENT[occasion as OccasionId];
  if (!c) return { title: "AI Invitation Maker | InviteMart" };
  return {
    title: `${c.title} — Online & Free | InviteMart`,
    description: c.blurb,
    alternates: { canonical: `/ai-invitation-maker/${occasion}` },
  };
}

export default async function OccasionMakerPage(
  props: PageProps<"/ai-invitation-maker/[occasion]">
) {
  const { occasion } = await props.params;
  const c = CONTENT[occasion as OccasionId];
  if (!c) notFound();
  const occ = OCCASIONS.find((o) => o.id === occasion)!;

  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-br from-ink via-brand-900 to-brand-700 text-white">
        <div className="relative mx-auto max-w-4xl px-4 py-14 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-gold-soft">
            {occ.icon} AI Invitation Maker
          </p>
          <h1 className="font-display text-3xl font-bold md:text-5xl">{c.title}</h1>
          <p className="mx-auto mt-4 max-w-xl text-white/80">{c.blurb}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm">
            {["🆓 Free", "⚡ Instant", "🌐 English & Hindi", "📱 WhatsApp share"].map((b) => (
              <span key={b} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="mb-6 font-display text-2xl font-bold text-ink">{c.tagline}</h2>
        <InvitationMaker initialOccasion={occasion as OccasionId} />
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 text-center">
        <p className="text-sm text-gray-500">
          Want a premium animated or PDF {occ.label.toLowerCase()} invitation?{" "}
          <Link href="/shop" className="font-semibold text-brand-600 hover:text-brand-700">
            Explore designer templates →
          </Link>
        </p>
      </section>
    </div>
  );
}
