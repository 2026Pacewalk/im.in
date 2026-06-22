"use client";

import { useState } from "react";
import Image from "next/image";
import { decode } from "@/lib/wp";

interface GalleryImage {
  id: number;
  src: string;
  thumbnail: string;
  alt: string;
}

export default function ProductGallery({
  images,
  name,
}: {
  images: GalleryImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative flex aspect-square flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-black/5 bg-gradient-to-br from-ink via-brand-900 to-brand-700 p-8 text-center text-white">
        <span className="text-5xl">🎬</span>
        <p className="font-display text-xl font-semibold leading-snug">{name}</p>
        <p className="text-sm text-white/70">
          Personalised preview shared on WhatsApp before delivery
        </p>
      </div>
    );
  }

  const current = images[active] ?? images[0];

  return (
    <div>
      <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-brand-50 to-rose-50">
        <Image
          key={current.id}
          src={current.src}
          alt={current.alt ? decode(current.alt) : name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {images.length > 1 && (
        <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto pb-1">
          {images.slice(0, 8).map((img, i) => (
            <button
              key={img.id}
              onMouseEnter={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={`relative aspect-square h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === active
                  ? "border-brand-600"
                  : "border-gray-100 hover:border-gray-300"
              }`}
            >
              <Image
                src={img.thumbnail || img.src}
                alt={img.alt ? decode(img.alt) : name}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
