"use client";

import { useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  function href(): string {
    return typeof window !== "undefined" ? window.location.href : "";
  }
  const t = encodeURIComponent(title);

  function copy() {
    const url = href();
    navigator.clipboard?.writeText(url).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      },
      () => {}
    );
  }

  const btn =
    "flex h-9 w-9 items-center justify-center rounded-full border border-black/10 text-gray-600 transition hover:border-brand-400 hover:text-brand-600";

  return (
    <div className="flex items-center gap-2">
      <span className="mr-1 text-xs font-medium uppercase tracking-wide text-gray-400">
        Share
      </span>
      <a
        aria-label="Share on WhatsApp"
        href={`https://wa.me/?text=${t}%20${encodeURIComponent(href())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24z" />
        </svg>
      </a>
      <a
        aria-label="Share on Facebook"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(href())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M13 22v-8h2.7l.4-3H13V9.2c0-.9.3-1.5 1.6-1.5H16V5.1c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H7v3h3v8h3z" />
        </svg>
      </a>
      <a
        aria-label="Share on X"
        href={`https://twitter.com/intent/tweet?text=${t}&url=${encodeURIComponent(href())}`}
        target="_blank"
        rel="noopener noreferrer"
        className={btn}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.9 2H22l-7.3 8.3L23 22h-6.6l-5.2-6.7L5.2 22H2l7.8-8.9L1.5 2h6.8l4.7 6.2L18.9 2zm-2.3 18h1.8L7.5 3.8H5.6L16.6 20z" />
        </svg>
      </a>
      <button type="button" onClick={copy} aria-label="Copy link" className={btn}>
        {copied ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
            <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
          </svg>
        )}
      </button>
    </div>
  );
}
