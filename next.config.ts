import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // WordPress / WooCommerce media hosts we pull images from
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
};

export default nextConfig;
