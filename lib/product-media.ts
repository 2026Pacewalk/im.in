// Pulls a product's preview VIDEO from the live product page. The Tbay theme
// stores it on a "View Video" modal button (data-tbaySrc) and it is not exposed
// by the REST/Store API — so we parse the rendered page (the fetch is deduped
// with getProductOptions's fetch of the same URL).
import "server-only";
import { SITE } from "./wp";

/** Normalise a YouTube/Vimeo URL to a clean embeddable URL. */
function toEmbed(raw: string): string | null {
  const url = raw.replace(/&amp;/g, "&").split("?")[0];
  const yt = url.match(/(?:youtube\.com\/embed\/|youtu\.be\/|youtube\.com\/watch\?v=)([A-Za-z0-9_-]{6,})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  if (/\.mp4($|\?)/i.test(raw)) return raw.replace(/&amp;/g, "&");
  return null;
}

export async function getProductVideo(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${SITE}/product/${slug}/`, {
      next: { revalidate: 3600 },
      headers: { Accept: "text/html" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    // Primary: the theme's video modal button.
    const tbay = html.match(/data-tbaysrc=["']([^"']+)["']/i);
    if (tbay) {
      const e = toEmbed(tbay[1]);
      if (e) return e;
    }
    // Fallback: any YouTube embed iframe in the page.
    const iframe = html.match(/youtube\.com\/embed\/[A-Za-z0-9_-]{6,}/i);
    if (iframe) return toEmbed(iframe[0]);
    return null;
  } catch {
    return null;
  }
}
