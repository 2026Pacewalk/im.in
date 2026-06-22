"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryNode } from "@/lib/wp";
import { decodeEntities } from "@/lib/entities";

export default function MobileMenu({ tree }: { tree: CategoryNode[] }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

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

      {open && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={close} />
          <div className="absolute left-0 top-0 h-full w-80 max-w-[85%] overflow-y-auto bg-white p-5 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xl font-extrabold">
                Invite<span className="text-brand-600">Mart</span>
              </span>
              <button
                aria-label="Close menu"
                onClick={close}
                className="rounded-lg p-1.5 hover:bg-gray-100"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="6" y1="6" x2="18" y2="18" />
                  <line x1="18" y1="6" x2="6" y2="18" />
                </svg>
              </button>
            </div>

            <Link
              href="/shop"
              onClick={close}
              className="block rounded-lg bg-brand-600 px-4 py-2.5 text-center font-semibold text-white"
            >
              Shop All Products
            </Link>

            <nav className="mt-4">
              {tree.map((cat) => (
                <details key={cat.id} className="group border-b border-gray-100">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2.5 font-medium text-gray-800">
                    <Link href={`/product-category/${cat.slug}`} onClick={close}>
                      {decodeEntities(cat.name)}
                    </Link>
                    {cat.children.length > 0 && (
                      <span className="text-gray-400 transition group-open:rotate-180">
                        ▾
                      </span>
                    )}
                  </summary>
                  {cat.children.length > 0 && (
                    <div className="pb-2 pl-3">
                      {cat.children.slice(0, 12).map((child) => (
                        <Link
                          key={child.id}
                          href={`/product-category/${child.slug}`}
                          onClick={close}
                          className="block py-1.5 text-sm text-gray-600"
                        >
                          {decodeEntities(child.name)}
                        </Link>
                      ))}
                    </div>
                  )}
                </details>
              ))}
              <Link
                href="/blog"
                onClick={close}
                className="block py-2.5 font-medium text-gray-800"
              >
                Blog
              </Link>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
