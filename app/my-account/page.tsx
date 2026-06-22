"use client";

import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { useWishlist } from "@/components/WishlistProvider";

// Fully local account area — no links leave the app. Auth is browser-side
// (see AuthProvider) until the backend exposes a real auth endpoint.

function Tile({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: string;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <span className="text-2xl">{icon}</span>
      <span className="mt-3 block font-display text-lg font-semibold text-ink">
        {title}
      </span>
      <span className="mt-1 block text-sm text-gray-500">{desc}</span>
    </Link>
  );
}

export default function MyAccountPage() {
  const { user, ready, logout } = useAuth();
  const { count } = useWishlist();

  if (!ready) {
    return <p className="py-24 text-center text-gray-400">Loading…</p>;
  }

  // ----- Logged out: sign-in / register prompt (all local) -----
  if (!user) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">
        <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-ink via-brand-900 to-brand-700 px-6 py-12 text-center text-white md:px-12">
          <h1 className="font-display text-3xl font-bold md:text-4xl">My Account</h1>
          <p className="mx-auto mt-3 max-w-md text-white/80">
            Sign in to view your account, or create one to save your wishlist and
            check out faster.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-full bg-white px-8 py-3 font-semibold text-brand-700 transition hover:bg-cream"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="rounded-full border border-white/30 px-8 py-3 font-semibold text-white transition hover:border-gold hover:text-gold-soft"
            >
              Create account
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-4 sm:grid-cols-2">
          <Tile
            href="/wishlist"
            icon="❤️"
            title="My Wishlist"
            desc="Designs you've saved on this device."
          />
          <Tile
            href="/cart"
            icon="🛒"
            title="My Cart"
            desc="Review items before checkout."
          />
        </section>
      </div>
    );
  }

  // ----- Logged in: dashboard -----
  const firstName = user.name.split(" ")[0] || user.name;

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <section className="flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-ink via-brand-900 to-brand-700 px-6 py-10 text-white md:px-10">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-gold-soft">
            My Account
          </p>
          <h1 className="mt-1 font-display text-3xl font-bold md:text-4xl">
            Hello, {firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-white/70">{user.email}</p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/30 px-6 py-2.5 text-sm font-semibold text-white transition hover:border-gold hover:text-gold-soft"
        >
          Sign out
        </button>
      </section>

      <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Tile
          href="/wishlist"
          icon="❤️"
          title="My Wishlist"
          desc={`${count} ${count === 1 ? "design" : "designs"} saved.`}
        />
        <Tile
          href="/cart"
          icon="🛒"
          title="My Cart"
          desc="Review items before checkout."
        />
        <Tile
          href="/shop"
          icon="🛍️"
          title="Continue Shopping"
          desc="Browse all invitation designs."
        />
      </section>

      <p className="mt-10 text-center text-sm text-gray-500">
        Need help with an order?{" "}
        <Link href="/contact-us" className="font-medium text-brand-600 hover:text-brand-700">
          Contact us
        </Link>
        .
      </p>
    </div>
  );
}
