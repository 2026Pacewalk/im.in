"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import type { CategoryNode } from "@/lib/wp";
import { decodeEntities } from "@/lib/entities";

export default function MobileMenu({ tree }: { tree: CategoryNode[] }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const close = () => setOpen(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const drawer = (
    <div className="fixed inset-0 z-[200] lg:hidden">
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={close}
      />
      {/* Panel */}
      <div
        className={`absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/5 px-5 py-4">
          <span className="font-display text-2xl font-bold text-ink">
            Invite<span className="text-brand-600">Mart</span>
          </span>
          <button
            aria-label="Close menu"
            onClick={close}
            className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          <Link
            href="/ai-invitation-maker"
            onClick={close}
            className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-800 px-4 py-3 font-semibold text-white shadow-sm"
          >
            ✦ AI Invitation Maker
          </Link>
          <Link
            href="/shop"
            onClick={close}
            className="mt-2 block rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-center font-semibold text-brand-700"
          >
            Shop all designs
          </Link>

          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              { href: "/my-account", label: "Account", icon: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" },
              { href: "/wishlist", label: "Wishlist", icon: "M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 1 0-7.8 7.8l1.1 1.1L12 21.2l7.8-7.8 1.1-1.1a5.5 5.5 0 0 0 0-7.8z" },
              { href: "/cart", label: "Cart", icon: "M6 6h15l-1.5 9h-12z M6 6 5 2H2 M9 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z M19 21a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" },
            ].map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={close}
                className="flex flex-col items-center gap-1.5 rounded-xl border border-black/5 py-3 text-xs font-medium text-gray-700 hover:border-brand-300 hover:text-brand-600"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  {i.icon.split(" M").map((d, k) => (
                    <path key={k} d={(k ? "M" : "") + d} />
                  ))}
                </svg>
                {i.label}
              </Link>
            ))}
          </div>

          <p className="mt-6 mb-1 px-1 text-xs font-semibold uppercase tracking-[0.18em] text-gray-400">
            Browse by occasion
          </p>
          <nav>
            {tree.map((cat) => (
              <details key={cat.id} className="group border-b border-black/5">
                <summary className="flex cursor-pointer list-none items-center justify-between py-3 font-medium text-ink">
                  <Link href={`/product-category/${cat.slug}`} onClick={close}>
                    {decodeEntities(cat.name)}
                  </Link>
                  {cat.children.length > 0 && (
                    <span className="text-gray-400 transition group-open:rotate-180">▾</span>
                  )}
                </summary>
                {cat.children.length > 0 && (
                  <div className="pb-2 pl-3">
                    {cat.children.slice(0, 12).map((child) => (
                      <Link
                        key={child.id}
                        href={`/product-category/${child.slug}`}
                        onClick={close}
                        className="flex items-center justify-between py-1.5 text-sm text-gray-600 hover:text-brand-600"
                      >
                        <span>{decodeEntities(child.name)}</span>
                        <span className="text-xs text-gray-400">{child.count}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </details>
            ))}
            <Link
              href="/blog"
              onClick={close}
              className="block py-3 font-medium text-ink"
            >
              Blog
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      {mounted && open && createPortal(drawer, document.body)}
    </>
  );
}
