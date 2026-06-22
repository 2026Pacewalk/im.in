"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { CategoryNode } from "@/lib/wp";
import { decodeEntities } from "@/lib/entities";

// Shorten long WooCommerce names for the top bar (full name stays in the panel).
function shortLabel(name: string): string {
  const s = name
    .replace(/\b(digital|invitations?|cards?)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return s || name;
}

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

export default function MegaMenu({ tree }: { tree: CategoryNode[] }) {
  const [active, setActive] = useState<number | null>(null);
  const featured = tree.slice(0, 7);
  const activeCat = featured.find((c) => c.id === active) || null;

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

        {featured.map((cat) => {
          const open = active === cat.id;
          const hasChildren = cat.children.length > 0;
          return (
            <Link
              key={cat.id}
              href={`/product-category/${cat.slug}`}
              onMouseEnter={() => setActive(cat.id)}
              className={`flex items-center whitespace-nowrap rounded-lg px-3 py-3.5 transition hover:bg-brand-50 hover:text-brand-600 ${
                open ? "bg-brand-50 text-brand-600" : ""
              }`}
            >
              {shortLabel(decodeEntities(cat.name))}
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
      {activeCat && activeCat.children.length > 0 && (
        <div className="absolute inset-x-0 top-full z-50 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="overflow-hidden rounded-b-3xl border border-black/5 bg-white shadow-2xl ring-1 ring-black/5">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px]">
                {/* Children */}
                <div className="p-7">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-bold text-ink">
                      {decodeEntities(activeCat.name)}
                    </h3>
                    <Link
                      href={`/product-category/${activeCat.slug}`}
                      className="text-sm font-semibold text-brand-600 transition hover:text-brand-700"
                    >
                      View all →
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-x-5 gap-y-0.5">
                    {activeCat.children.slice(0, 18).map((child) => (
                      <Link
                        key={child.id}
                        href={`/product-category/${child.slug}`}
                        className="group flex items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-sm text-gray-600 transition hover:bg-brand-50 hover:text-brand-700"
                      >
                        <span className="truncate">
                          {decodeEntities(child.name)}
                        </span>
                        <span className="shrink-0 text-xs text-gray-400 group-hover:text-brand-500">
                          {child.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Featured tile */}
                <Link
                  href={`/product-category/${activeCat.slug}`}
                  className="relative flex min-h-[220px] flex-col justify-end overflow-hidden bg-gradient-to-br from-brand-700 via-brand-800 to-ink p-7 text-white"
                >
                  {activeCat.image?.src && (
                    <>
                      <Image
                        src={activeCat.image.src}
                        alt={decodeEntities(activeCat.name)}
                        fill
                        sizes="300px"
                        className="object-cover opacity-40"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/40 to-transparent" />
                    </>
                  )}
                  <div className="relative">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-soft">
                      Featured
                    </p>
                    <p className="mt-2 font-display text-2xl font-bold leading-tight">
                      {shortLabel(decodeEntities(activeCat.name))}
                    </p>
                    <p className="mt-1 text-sm text-white/80">
                      {activeCat.count}+ designs to explore
                    </p>
                    <span className="mt-4 inline-block rounded-full bg-white px-5 py-2 text-sm font-semibold text-brand-700 transition hover:bg-cream">
                      Explore →
                    </span>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
