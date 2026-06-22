"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { toPng } from "html-to-image";
import InvitationCard from "@/components/ai/InvitationCard";
import { WHATSAPP_NUMBER } from "@/lib/wcpa-types";
import {
  OCCASIONS,
  TONES,
  THEMES,
  type InvitationInput,
  type InvitationCopy,
  type OccasionId,
  type ToneId,
} from "@/lib/ai-invite";

const FIELD =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-brand-400";

export default function InvitationMaker() {
  const [occasion, setOccasion] = useState<OccasionId>("wedding");
  const [tone, setTone] = useState<ToneId>("elegant");
  const [hostNames, setHostNames] = useState("Aarav & Diya");
  const [date, setDate] = useState("Sunday, 14 December 2026");
  const [time, setTime] = useState("7:00 PM onwards");
  const [venue, setVenue] = useState("The Grand Ballroom, Jaipur");
  const [extra, setExtra] = useState("");
  const [themeIdx, setThemeIdx] = useState(0);

  const [copy, setCopy] = useState<InvitationCopy | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);
  const theme = THEMES[themeIdx];

  const generate = useCallback(
    async (variant: number) => {
      setLoading(true);
      setError(null);
      const input: InvitationInput = {
        occasion,
        tone,
        hostNames,
        date,
        time,
        venue,
        extra,
      };
      try {
        const res = await fetch("/api/ai/invitation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input, variant }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Generation failed");
        setCopy(data as InvitationCopy);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Generation failed");
      } finally {
        setLoading(false);
      }
    },
    [occasion, tone, hostNames, date, time, venue, extra]
  );

  // First render: produce a card so the preview is never empty.
  useEffect(() => {
    generate(0.42);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function download() {
    if (!cardRef.current) return;
    try {
      const url = await toPng(cardRef.current, { pixelRatio: 2.5, cacheBust: true });
      const a = document.createElement("a");
      a.download = `invitation-${occasion}.png`;
      a.href = url;
      a.click();
    } catch {
      setError("Could not export the image. Please try again.");
    }
  }

  function whatsappHref(): string {
    if (!copy) return `https://wa.me/${WHATSAPP_NUMBER}`;
    const msg =
      `*${copy.names}*\n${copy.headline}\n` +
      (date ? `${date}\n` : "") +
      (time ? `${time}\n` : "") +
      (venue ? `${venue}\n` : "") +
      `\n${copy.closing}\n\nMade with InviteMart AI`;
    return `https://wa.me/?text=${encodeURIComponent(msg)}`;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_minmax(360px,460px)]">
      {/* ---- Controls ---- */}
      <div className="space-y-6">
        {/* Occasion */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">
            Occasion
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setOccasion(o.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  occasion === o.id
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-gray-200 text-gray-700 hover:border-brand-400"
                }`}
              >
                <span className="mr-1">{o.icon}</span>
                {o.label}
              </button>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Host name(s)
            </span>
            <input
              value={hostNames}
              onChange={(e) => setHostNames(e.target.value)}
              placeholder="e.g. Aarav & Diya"
              className={FIELD}
            />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Date</span>
            <input value={date} onChange={(e) => setDate(e.target.value)} className={FIELD} />
          </label>
          <label>
            <span className="mb-1 block text-sm font-medium text-gray-700">Time</span>
            <input value={time} onChange={(e) => setTime(e.target.value)} className={FIELD} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">Venue</span>
            <input value={venue} onChange={(e) => setVenue(e.target.value)} className={FIELD} />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-1 block text-sm font-medium text-gray-700">
              Anything to add? <span className="text-gray-400">(optional)</span>
            </span>
            <input
              value={extra}
              onChange={(e) => setExtra(e.target.value)}
              placeholder="e.g. Followed by dinner and dancing"
              className={FIELD}
            />
          </label>
        </div>

        {/* Tone */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Writing tone</label>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTone(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition ${
                  tone === t.id
                    ? "border-ink bg-ink text-white"
                    : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Theme */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-ink">Design theme</label>
          <div className="flex flex-wrap gap-2.5">
            {THEMES.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeIdx(i)}
                title={t.name}
                aria-label={t.name}
                style={{ background: t.bg }}
                className={`h-10 w-10 rounded-full ring-2 ring-offset-2 transition ${
                  i === themeIdx ? "ring-brand-600" : "ring-transparent hover:ring-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Generate */}
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => generate(Math.random())}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-brand-700 disabled:opacity-60"
          >
            ✦ {loading ? "Generating…" : copy ? "Regenerate wording" : "Generate with AI"}
          </button>
        </div>
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>

      {/* ---- Preview ---- */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        {copy ? (
          <InvitationCard ref={cardRef} copy={copy} theme={theme} details={{ date, time, venue }} />
        ) : (
          <div className="flex h-[520px] items-center justify-center rounded-2xl border border-dashed border-gray-200 text-gray-400">
            Your invitation preview will appear here
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={download}
            disabled={!copy}
            className="rounded-xl bg-ink px-5 py-3 text-center font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            ⬇ Download PNG
          </button>
          <a
            href={whatsappHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-[#25D366] px-5 py-3 text-center font-semibold text-white transition hover:brightness-95"
          >
            Share on WhatsApp
          </a>
        </div>

        <Link
          href="/shop"
          className="mt-3 block rounded-xl border border-brand-200 bg-brand-50 px-5 py-3 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-100"
        >
          Want a premium animated version? Order a custom design →
        </Link>
        <p className="mt-2 text-center text-xs text-gray-400">
          Free AI draft · Personalised video &amp; PDF cards available from our designers
        </p>
      </div>
    </div>
  );
}
