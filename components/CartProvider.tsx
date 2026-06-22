"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Cart } from "@/lib/cart-types";

interface CartContextValue {
  cart: Cart | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  add: (id: number, quantity?: number) => Promise<void>;
  update: (key: string, quantity: number) => Promise<void>;
  remove: (key: string) => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) setCart(data);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const post = useCallback(
    async (path: string, body: unknown, openOnSuccess = false) => {
      setBusy(true);
      setError(null);
      try {
        const res = await fetch(path, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Cart error");
        setCart(data);
        if (openOnSuccess) setDrawerOpen(true);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Cart error");
      } finally {
        setBusy(false);
      }
    },
    []
  );

  const value: CartContextValue = {
    cart,
    loading,
    busy,
    error,
    drawerOpen,
    openDrawer: () => setDrawerOpen(true),
    closeDrawer: () => setDrawerOpen(false),
    add: (id, quantity = 1) => post("/api/cart/add", { id, quantity }, true),
    update: (key, quantity) => post("/api/cart/update", { key, quantity }),
    remove: (key) => post("/api/cart/remove", { key }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
