import Link from "next/link";

const COL_SHOP = [
  { label: "Wedding Invitation Video", href: "/product-category/video-invitation/wedding-invitation-video" },
  { label: "Engagement Invitation", href: "/product-category/engagement-invitation" },
  { label: "Birthday Invitation", href: "/product-category/baby-kids/birthday-party-invitation" },
  { label: "Anniversary Invitation", href: "/product-category/anniversary-party-invitation" },
  { label: "Housewarming Invitation", href: "/product-category/housewarming-invitation" },
];

const COL_INFO = [
  { label: "Shop All", href: "/shop" },
  { label: "My Account", href: "/my-account" },
  { label: "My Wishlist", href: "/wishlist" },
  { label: "Become a Reseller", href: "/become-a-reseller" },
  { label: "Blog", href: "/blog" },
];

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 md:grid-cols-4">
        <div className="col-span-2 md:col-span-1">
          <div className="font-display text-2xl font-bold text-white">
            Invite<span className="text-gold">Mart</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            Online digital invitation maker — custom wedding, party and event
            invitations, e-cards and invitation videos, personalised for you.
          </p>
          <a
            href="mailto:invitemart@gmail.com"
            className="mt-4 inline-block text-sm text-gold-soft hover:text-gold"
          >
            invitemart@gmail.com
          </a>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-semibold text-white">
            Popular Categories
          </h3>
          <ul className="space-y-2.5 text-sm">
            {COL_SHOP.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-semibold text-white">
            Company
          </h3>
          <ul className="space-y-2.5 text-sm">
            {COL_INFO.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-gold-soft">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-display text-base font-semibold text-white">
            Made with care
          </h3>
          <p className="text-sm leading-relaxed">
            Personalised invitations delivered digitally — ready to share on
            WhatsApp, email and social media in minutes.
          </p>
        </div>
      </div>

      <div className="gold-rule opacity-40" />
      <div className="py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} InviteMart. Crafted for life’s celebrations.
      </div>
    </footer>
  );
}
