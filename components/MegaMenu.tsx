"use client";

import { useState } from "react";
import Link from "next/link";
import type { CategoryNode } from "@/lib/wp";
import { decodeEntities } from "@/lib/entities";

export default function MegaMenu({ tree }: { tree: CategoryNode[] }) {
  const [active, setActive] = useState<number | null>(null);
  const featured = tree.slice(0, 8);

  return (
    <div className="hidden border-t border-gray-100 bg-white lg:block">
      <div
        className="mx-auto flex max-w-7xl items-center gap-6 px-4 text-sm font-medium text-gray-700"
        onMouseLeave={() => setActive(null)}
      >
        <Link href="/shop" className="py-3 hover:text-brand-600">
          All Products
        </Link>
        {featured.map((cat) => (
          <div key={cat.id} onMouseEnter={() => setActive(cat.id)}>
            <Link
              href={`/product-category/${cat.slug}`}
              className={`block py-3 hover:text-brand-600 ${
                active === cat.id ? "text-brand-600" : ""
              }`}
            >
              {decodeEntities(cat.name)}
            </Link>

            {active === cat.id && cat.children.length > 0 && (
              <div className="absolute inset-x-0 top-full z-50 border-t border-gray-100 bg-white shadow-xl">
                <div className="mx-auto grid max-w-7xl grid-cols-4 gap-x-6 gap-y-1 px-4 py-6">
                  {cat.children.slice(0, 16).map((child) => (
                    <Link
                      key={child.id}
                      href={`/product-category/${child.slug}`}
                      className="flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-600 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span className="truncate">{decodeEntities(child.name)}</span>
                      <span className="ml-2 shrink-0 text-xs text-gray-400">
                        {child.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        <Link href="/blog" className="py-3 hover:text-brand-600">
          Blog
        </Link>
      </div>
    </div>
  );
}
