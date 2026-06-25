"use client";

import { useState } from "react";
import Link from "next/link";
import { MENU } from "@/lib/menu";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`ml-0.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function MegaMenu() {
  const [active, setActive] = useState<string | null>(null);
  const activeItem = MENU.find((m) => m.label === active) || null;

  return (
    <div
      className="relative hidden border-t border-black/5 bg-white lg:block"
      onMouseLeave={() => setActive(null)}
    >
      <div className="mx-auto flex max-w-7xl items-center gap-0.5 px-4 text-sm font-medium text-ink/80">
        <Link
          href="/shop"
          onMouseEnter={() => setActive(null)}
          className="rounded-lg px-3 py-3.5 transition hover:bg-brand-50 hover:text-brand-600"
        >
          All designs
        </Link>

        {MENU.map((item) => {
          const open = active === item.label;
          const hasChildren = item.children.length > 0;
          return (
            <Link
              key={item.label}
              href={item.href}
              onMouseEnter={() => setActive(item.label)}
              className={`flex items-center whitespace-nowrap rounded-lg px-3 py-3.5 transition hover:bg-brand-50 hover:text-brand-600 ${
                open ? "bg-brand-50 text-brand-600" : ""
              }`}
            >
              {item.short}
              {hasChildren && <Chevron open={open} />}
            </Link>
          );
        })}

        <Link
          href="/blog"
          onMouseEnter={() => setActive(null)}
          className="ml-auto rounded-lg px-3 py-3.5 transition hover:bg-brand-50 hover:text-brand-600"
        >
          Blog
        </Link>
      </div>

      {/* Dropdown panel */}
      {activeItem && activeItem.children.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-b-3xl border border-black/5 bg-white shadow-2xl ring-1 ring-black/5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px]">
                {/* Children */}
                <div className="p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {activeItem.label}
                    </h3>
                    <Link
                      href={activeItem.href}
                      className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-x-5 gap-y-0.5">
                    {activeItem.children.map((child) => (
                      <Link
                        key={child.href + child.label}
                        href={child.href}
                        className="truncate rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Featured tile */}
                <Link
                  href={activeItem.href}
                  className="relative flex min-h-[220px] flex-col justify-end overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink p-7 text-white"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
                    Featured
                  </p>
                  <p className="mt-2 font-display text-2xl font-bold leading-tight">
                    {activeItem.short}
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Explore all {activeItem.label.toLowerCase()}
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-cream">
                    Explore →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
