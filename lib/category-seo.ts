// Lightweight, category-aware SEO copy. Used as a fallback when the WordPress
// term has no (or thin) description, so every category page ships a unique-ish
// intro + FAQ block — the on-page depth that helps these pages rank.

export function titleizeSlug(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** A short editorial intro for a category, woven from its name. */
export function categoryIntro(name: string, count: number): string {
  const n = count > 0 ? `${count}+` : "a range of";
  return (
    `Explore ${n} beautifully designed ${name.toLowerCase()} to make your celebration ` +
    `unforgettable. Each design is fully personalised with your names, date and details, ` +
    `delivered digitally as a video or PDF card — ready to share instantly on WhatsApp, ` +
    `Instagram and email. Browse the collection below and order in minutes.`
  );
}

export interface Faq {
  q: string;
  a: string;
}

/** Generated, category-specific FAQs (great for FAQ rich results). */
export function categoryFaqs(name: string, count: number): Faq[] {
  const lower = name.toLowerCase();
  return [
    {
      q: `How do I create a ${lower.replace(/s$/, "")}?`,
      a: `Pick a design from our ${
        count > 0 ? `${count}+ ` : ""
      }${lower}, share your event details, and we personalise it for you. You'll receive your digital card — usually within 4–6 working hours.`,
    },
    {
      q: `Can I personalise the ${lower.replace(/ invitations?$/i, "")} design?`,
      a: `Yes. Names, date, venue, photos, colours and even the language (Hindi, English and regional Indian languages) can be customised on most designs.`,
    },
    {
      q: `How will I receive and share my invitation?`,
      a: `Your ${lower.replace(
        /s$/,
        ""
      )} is delivered as a downloadable video or PDF, optimised for WhatsApp, Instagram and email — no printing or app required.`,
    },
    {
      q: `How much do ${lower} cost?`,
      a: `Pricing depends on the design and format. PDF cards start from as little as ₹49 and premium animated video invitations are available too — see each product for its exact price.`,
    },
  ];
}
