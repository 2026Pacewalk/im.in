import type { NextConfig } from "next";

// Content pages are identical for every visitor (the cart is client-side), so
// they are safe to cache at the CDN edge. We send a public s-maxage so
// Cloudflare (with a "cache eligible / respect origin TTL" rule) can serve them
// from its edge instead of round-tripping to the VPS. Cart/checkout/account/api
// keep Next's default no-store and are never listed here.
const EDGE_CACHE = "public, max-age=0, s-maxage=3600, stale-while-revalidate=604800";
const cacheable = (source: string) => ({
  source,
  headers: [{ key: "Cache-Control", value: EDGE_CACHE }],
});

const nextConfig: NextConfig = {
  images: {
    // Serve product images directly from the self-hosted files (nginx + CF edge)
    // instead of Next's optimizer. The optimizer fetched sources over
    // invitemart.in, which the VPS resolves to the old WordPress (some images
    // 302 there) — making images fragile. Direct serving is reliable and faster.
    unoptimized: true,
    minimumCacheTTL: 604800,
    remotePatterns: [
      { protocol: "https", hostname: "invitemart.in" },
      { protocol: "https", hostname: "www.invitemart.in" },
      { protocol: "https", hostname: "invitemart.com" },
      { protocol: "https", hostname: "i0.wp.com" },
      { protocol: "https", hostname: "i1.wp.com" },
      { protocol: "https", hostname: "i2.wp.com" },
      { protocol: "https", hostname: "secure.gravatar.com" },
    ],
  },
  async redirects() {
    return [
      // Google Search Console had /sitemap (the HTML page) submitted as a
      // sitemap. Redirect it to the real XML so the submission resolves.
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
    ];
  },
  async headers() {
    return [
      cacheable("/"),
      cacheable("/shop"),
      cacheable("/product/:slug*"),
      cacheable("/product-category/:path*"),
      cacheable("/product-tag/:slug*"),
      cacheable("/category/:slug*"),
      cacheable("/blog"),
      cacheable("/blog/:slug*"),
    ];
  },
};

export default nextConfig;
