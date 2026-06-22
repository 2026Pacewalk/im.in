"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { StoreProduct } from "@/lib/wp";

// A wishlist that lives entirely in the browser (localStorage). The headless
// backend blocks programmatic login (reCAPTCHA + login-attempt limiting and no
// JWT), so a per-visitor wishlist can't be tied to a WooCommerce account from
// here — localStorage gives a real, instant, offline-capable wishlist instead.

const STORAGE_KEY = "im_wishlist";

/** Only the fields the wishlist UI / ProductCard needs, to keep storage lean. */
export type WishlistItem = Pick<
  StoreProduct,
  "id" | "name" | "slug" | "prices" | "images" | "on_sale"
>;

interface WishlistContextValue {
  items: WishlistItem[];
  count: number;
  ready: boolean;
  has: (id: number) => boolean;
  toggle: (product: WishlistItem) => void;
  remove: (id: number) => void;
  clear: () => void;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within WishlistProvider");
  return ctx;
}

function pick(p: WishlistItem): WishlistItem {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    prices: p.prices,
    images: p.images,
    on_sale: p.on_sale,
  };
}

export default function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [ready, setReady] = useState(false);

  // Load once on mount (client only).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      /* ignore malformed storage */
    } finally {
      setReady(true);
    }
  }, []);

  // Persist on every change (after the initial load).
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* storage full / unavailable — ignore */
    }
  }, [items, ready]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key !== STORAGE_KEY) return;
      try {
        const parsed = e.newValue ? JSON.parse(e.newValue) : [];
        if (Array.isArray(parsed)) setItems(parsed);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const has = useCallback(
    (id: number) => items.some((i) => i.id === id),
    [items]
  );

  const toggle = useCallback((product: WishlistItem) => {
    setItems((prev) =>
      prev.some((i) => i.id === product.id)
        ? prev.filter((i) => i.id !== product.id)
        : [pick(product), ...prev]
    );
  }, []);

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value: WishlistContextValue = {
    items,
    count: items.length,
    ready,
    has,
    toggle,
    remove,
    clear,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}
