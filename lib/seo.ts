import type { Metadata } from "next";
import { decode, type YoastHead } from "./wp";

/**
 * Map the Yoast SEO data (already authored on invitemart.in) to a Next.js
 * Metadata object so meta titles, descriptions, canonicals, robots, Open Graph
 * and Twitter cards are preserved exactly as on the live site.
 */
export function yoastToMetadata(
  yoast: YoastHead | undefined,
  fallback: { title: string; description?: string }
): Metadata {
  const title = decode(yoast?.title) || fallback.title;
  const description =
    decode(yoast?.description) || fallback.description || undefined;

  const robots = yoast?.robots
    ? {
        index: yoast.robots.index !== "noindex",
        follow: yoast.robots.follow !== "nofollow",
      }
    : undefined;

  const ogImages = (yoast?.og_image || []).map((img) => ({
    url: img.url,
    width: img.width,
    height: img.height,
  }));

  return {
    title,
    description,
    ...(robots ? { robots } : {}),
    ...(yoast?.canonical
      ? { alternates: { canonical: yoast.canonical } }
      : {}),
    openGraph: {
      title: decode(yoast?.og_title) || title,
      description: decode(yoast?.og_description) || description,
      url: yoast?.canonical,
      type: (yoast?.og_type as "website" | "article") || "website",
      siteName: "InviteMart",
      ...(ogImages.length ? { images: ogImages } : {}),
    },
    twitter: {
      card:
        (yoast?.twitter_card as "summary" | "summary_large_image") ||
        "summary_large_image",
      title: decode(yoast?.og_title) || title,
      description: decode(yoast?.og_description) || description,
      ...(ogImages.length ? { images: ogImages.map((i) => i.url) } : {}),
    },
  };
}
