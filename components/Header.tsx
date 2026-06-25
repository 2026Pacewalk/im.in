import Link from "next/link";
import MegaMenu from "@/components/MegaMenu";
import MobileMenu from "@/components/MobileMenu";
import CartButton from "@/components/CartButton";
import WishlistLink from "@/components/WishlistLink";
import AccountLink from "@/components/AccountLink";

function Logo() {
  return (
    <Link href="/" className="shrink-0 leading-none">
      <span className="font-display text-2xl font-bold tracking-tight text-ink">
        Invite<span className="text-brand-600">Mart</span>
      </span>
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white/95 shadow-sm backdrop-blur">
      {/* Announcement bar */}
      <div className="bg-ink text-center text-xs tracking-wide text-gold-soft">
        <div className="mx-auto max-w-7xl px-4 py-2">
          ✦ Free design assistance on WhatsApp · Instant digital delivery · 1,800+ designs
        </div>
      </div>

      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3.5 md:gap-6">
        <MobileMenu />
        <Logo />

        <form action="/shop" className="relative hidden flex-1 md:block">
          <input
            type="search"
            name="q"
            placeholder="Search invitations, e.g. wedding video…"
            className="w-full rounded-full border border-black/10 bg-cream py-2.5 pl-5 pr-24 text-sm outline-none transition focus:border-brand-400 focus:bg-white"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 px-4 py-1.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Search
          </button>
        </form>

        <nav className="ml-auto hidden shrink-0 items-center gap-5 text-sm font-medium text-ink/80 md:flex">
          <Link href="/shop" className="hover:text-brand-600">
            Shop
          </Link>
          <Link
            href="/ai-invitation-maker"
            className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-brand-600 to-brand-800 px-3 py-1.5 text-white shadow-sm transition hover:brightness-110"
          >
            ✦ AI Maker
          </Link>
          <Link href="/become-a-reseller" className="hover:text-brand-600">
            Reseller
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-0.5 md:ml-0">
          <span className="hidden sm:block">
            <WishlistLink />
          </span>
          <AccountLink />
          <CartButton />
        </div>
      </div>

      {/* Mobile search */}
      <form action="/shop" className="relative px-4 pb-3 md:hidden">
        <input
          type="search"
          name="q"
          placeholder="Search invitations…"
          className="w-full rounded-full border border-black/10 bg-cream py-2.5 pl-5 pr-20 text-sm outline-none focus:border-brand-400 focus:bg-white"
        />
        <button
          type="submit"
          className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 px-4 py-1.5 text-xs font-medium text-white"
        >
          Go
        </button>
      </form>

      <MegaMenu />
    </header>
  );
}
