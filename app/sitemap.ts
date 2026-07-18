import type { MetadataRoute } from "next";
import { getProducts, getAllStoreCategories } from "@/lib/wp";

const SITE = "https://invitemart.in";

// content pages worth indexing (cart/checkout/account/login excluded)
const STATIC_PAGES = [
  "", "/shop", "/blog", "/faq", "/contact-us", "/about-us",
  "/privacy-policy", "/terms-conditions", "/return-policy",
  "/gst-pay-online", "/become-a-reseller", "/discount-offers-coupon-code",
  "/wedding-invitations", "/caricature-invitations",
  "/ai-invitation-maker", "/free-festival-invitations", "/rsvp", "/site-map",
];

export const revalidate = 86400;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [productsRes, categories] = await Promise.all([
    getProducts({ perPage: 5000 }).catch(() => ({ items: [] as { slug: string }[] })),
    getAllStoreCategories().catch(() => [] as { slug: string }[]),
  ]);
  const now = new Date();

  const pages: MetadataRoute.Sitemap = STATIC_PAGES.map((p) => ({
    url: `${SITE}${p}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: p === "" ? 1 : 0.6,
  }));

  const cats: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${SITE}/product-category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const products: MetadataRoute.Sitemap = productsRes.items.map((p) => ({
    url: `${SITE}/product/${p.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...pages, ...cats, ...products];
}
