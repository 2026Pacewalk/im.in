// Shared cart types (safe to import from client and server).
import type { CurrencyInfo } from "./store-types";

export interface CartImage {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
}
export interface CartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  permalink: string;
  images: CartImage[];
  prices: CurrencyInfo & { price: string; regular_price: string };
  totals: CurrencyInfo & { line_total: string };
}
export interface CartTotals extends CurrencyInfo {
  total_items: string;
  total_price: string;
}
export interface Cart {
  items_count: number;
  items: CartItem[];
  totals: CartTotals;
  needs_payment: boolean;
}
