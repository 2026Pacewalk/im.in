import Link from "next/link";

const INFORMATION = [
  { label: "Online Invitation Card Maker", href: "/shop" },
  { label: "Caricature Invitation Maker", href: "/custom-wedding-caricature-invitation-maker-online" },
  { label: "Wedding Invitation Video", href: "/product-category/video-invitation/wedding-invitation-video" },
  { label: "Wedding Invitation PDF", href: "/product-category/pdf-invitation-card" },
  { label: "Birthday Invitation Cards", href: "/product-category/baby-kids/birthday-party-invitation" },
  { label: "Ganpati Invitation Card", href: "/shop?q=ganpati" },
  { label: "Festival Wishes", href: "/shop?q=festival" },
  { label: "Blogs", href: "/blog" },
  { label: "Site Map", href: "/sitemap" },
  { label: "Press Release", href: "/press-release" },
];

const USER_AREA = [
  { label: "My account", href: "/my-account" },
  { label: "FAQs", href: "/faq" },
  { label: "Contact Us", href: "/contact-us" },
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Terms & Conditions", href: "/terms-conditions" },
  { label: "Return Policy", href: "/return-policy" },
  { label: "GST Pay Online", href: "/gst-pay-online" },
  { label: "Become a Reseller", href: "/become-a-reseller" },
  { label: "Discount Coupon Codes", href: "/discount-offers-coupon-code" },
];

const SOCIALS: { label: string; href: string; icon: React.ReactNode }[] = [
  { label: "Facebook", href: "https://www.facebook.com/DigitalInvitationcards/", icon: <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /> },
  { label: "X", href: "https://twitter.com/InviteMart", icon: <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.22-6.82-5.97 6.82H1.66l7.73-8.84L1.24 2.25h6.83l4.71 6.23 5.46-6.23zm-1.16 17.52h1.83L7.01 4.13H5.04l12.04 15.64z" /> },
  { label: "YouTube", href: "https://www.youtube.com/c/InviteMartDigitalInvitationMaker", icon: <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" /> },
  { label: "Instagram", href: "https://www.instagram.com/invitemart/", icon: <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58zm6.85-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0z" /> },
  { label: "Pinterest", href: "https://in.pinterest.com/invitemart/", icon: <path d="M12 2a10 10 0 0 0-3.65 19.31c-.05-.78-.1-1.98.02-2.83.11-.77.74-4.9.74-4.9s-.19-.38-.19-.94c0-.88.51-1.54 1.15-1.54.54 0 .8.41.8.9 0 .54-.35 1.36-.53 2.12-.15.63.32 1.15.94 1.15 1.13 0 2-1.19 2-2.91 0-1.52-1.09-2.58-2.65-2.58-1.81 0-2.87 1.36-2.87 2.76 0 .55.21 1.13.47 1.45a.19.19 0 0 1 .04.18l-.18.72c-.03.12-.09.15-.21.09-1.18-.55-1.92-2.27-1.92-3.65 0-2.97 2.16-5.7 6.22-5.7 3.27 0 5.81 2.33 5.81 5.44 0 3.25-2.05 5.86-4.89 5.86-.95 0-1.85-.5-2.16-1.08l-.59 2.24c-.21.82-.78 1.85-1.17 2.48A10 10 0 1 0 12 2z" /> },
  { label: "LinkedIn", href: "https://www.linkedin.com/showcase/invitemart/", icon: <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /> },
];

const PAYMENTS = ["Visa", "Mastercard", "PayPal", "GPay", "Paytm", "PhonePe"];

function Column({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">{title}</h3>
      <ul className="space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition hover:text-gold-soft">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-20 bg-ink text-white/70">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-14 lg:grid-cols-4">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-1">
          <div className="font-display text-2xl font-bold text-white">
            Invite<span className="text-gold">Mart</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed">
            <strong className="text-white/90">InviteMart</strong>, powered by
            Pacewalk, is a professional graphic-designing company that strives to
            provide the most sophisticated digital invitation card services by
            replicating traditional paper-based invite cards.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            From weddings to birthday parties, housewarming and corporate events,
            InviteMart is a reliable online solution for every occasion.{" "}
            <Link href="/about-us" className="text-gold-soft hover:text-gold">
              Read More
            </Link>
          </p>
        </div>

        <Column title="Information" links={INFORMATION} />
        <Column title="User Area" links={USER_AREA} />

        {/* Contact */}
        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wide text-white">
            Contact Info
          </h3>
          <a href="tel:+917307344844" className="block text-sm hover:text-gold-soft">
            📞 +91 73073 44844
          </a>
          <a
            href="mailto:invitemart@gmail.com"
            className="mt-2 block text-sm hover:text-gold-soft"
          >
            ✉ invitemart@gmail.com
          </a>

          <h4 className="mt-6 text-sm font-bold uppercase tracking-wide text-white">
            Subscribe our YouTube channel
          </h4>
          <a
            href="https://www.youtube.com/c/InviteMartDigitalInvitationMaker?sub_confirmation=1"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-[#FF0000] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" />
            </svg>
            Subscribe
          </a>

          <div className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-white/60 transition hover:text-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  {s.icon}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="gold-rule opacity-40" />
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-5 text-xs text-white/50 md:flex-row">
        <span>
          © {new Date().getFullYear()} InviteMart — All Rights Reserved. Powered by{" "}
          <span className="font-semibold text-white/70">PACEWALK</span>
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {PAYMENTS.map((p) => (
            <span
              key={p}
              className="rounded bg-white/10 px-2 py-1 text-[11px] font-medium text-white/70"
            >
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
