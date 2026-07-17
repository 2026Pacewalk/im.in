// Shared type definitions ONLY — no runtime code. Safe to import from client
// components without pulling any server module (wp.ts / catalog.ts / fs) into
// the browser bundle. (This build's bundler does not reliably erase `import
// type` edges, so client-reachable code imports types from here, not wp.ts.)

export interface StorePrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreImage {
  id: number;
  src: string;
  thumbnail: string;
  srcset: string;
  alt: string;
  name: string;
}

export interface StoreTermRef {
  id: number;
  name: string;
  slug: string;
  link: string;
}

export interface StoreProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  type: string;
  sku?: string | null;
  short_description: string;
  description: string;
  on_sale: boolean;
  prices: StorePrices;
  price_html: string;
  average_rating: string;
  review_count: number;
  images: StoreImage[];
  categories: StoreTermRef[];
  tags: StoreTermRef[];
  has_options: boolean;
  is_in_stock: boolean;
}

export interface StoreCategory {
  id: number;
  name: string;
  slug: string;
  parent: number;
  count: number;
  description: string;
  image: StoreImage | null;
}

export interface YoastHead {
  title?: string;
  description?: string;
  robots?: Record<string, string>;
  canonical?: string;
  og_title?: string;
  og_description?: string;
  og_image?: { url: string; width?: number; height?: number }[];
  og_type?: string;
  twitter_card?: string;
  schema?: unknown;
}

export interface WpContentNode {
  id: number;
  slug: string;
  link: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt?: { rendered: string };
  date?: string;
  yoast_head_json?: YoastHead;
  _embedded?: {
    "wp:featuredmedia"?: {
      source_url: string;
      alt_text: string;
      media_details?: { width: number; height: number };
    }[];
  };
}

export interface WpTerm {
  id: number;
  name: string;
  slug: string;
  description: string;
  count: number;
  link: string;
  yoast_head_json?: YoastHead;
}

export interface CurrencyInfo {
  currency_minor_unit?: number;
  currency_prefix?: string;
  currency_symbol?: string;
  currency_suffix?: string;
}

export interface ProductQuery {
  page?: number;
  perPage?: number;
  category?: string; // slug
  tag?: string; // slug
  search?: string;
  orderby?: "date" | "price" | "popularity" | "rating" | "title";
  order?: "asc" | "desc";
  onSale?: boolean;
}
