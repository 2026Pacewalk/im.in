"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductVideo({
  url,
  name,
  poster,
}: {
  url: string;
  name: string;
  poster?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const isEmbed = /youtube\.com\/embed\//.test(url) || /player\.vimeo/.test(url);

  return (
    <div className="overflow-hidden rounded-2xl border border-black/5 bg-black shadow-sm">
      {playing ? (
        <div className="aspect-video w-full">
          {isEmbed ? (
            <iframe
              src={`${url}?autoplay=1&rel=0`}
              title={`${name} — preview video`}
              className="h-full w-full"
              allow="autoplay; encrypted-media; fullscreen"
              allowFullScreen
            />
          ) : (
            <video src={url} controls autoPlay className="h-full w-full" />
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play preview video of ${name}`}
          className="group relative flex aspect-video w-full items-center justify-center overflow-hidden"
        >
          {poster ? (
            <Image
              src={poster}
              alt={`${name} preview`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover opacity-70 transition group-hover:opacity-90"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-ink" />
          )}
          <div className="absolute inset-0 bg-black/30" />
          <span className="relative flex flex-col items-center gap-2 text-white">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-brand-700 shadow-lg transition group-hover:scale-110">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
            <span className="text-sm font-semibold drop-shadow">
              ▶ Watch preview video
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
