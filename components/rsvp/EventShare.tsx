"use client";

import { useEffect, useState } from "react";

export default function EventShare({
  id,
  title,
  date,
}: {
  id: string;
  title: string;
  date?: string;
}) {
  const [origin, setOrigin] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => setOrigin(window.location.origin), []);

  const link = `${origin}/rsvp/${id}`;

  function copy() {
    navigator.clipboard?.writeText(link).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  function wa(text: string) {
    return `https://wa.me/?text=${encodeURIComponent(`${text}\n${link}`)}`;
  }

  const REMINDERS = [
    { label: "Invite", msg: `You're invited to ${title}${date ? ` on ${date}` : ""}! Please RSVP here:` },
    { label: "7 days to go", msg: `Just 7 days to go for ${title}! If you haven't yet, please RSVP:` },
    { label: "3 days to go", msg: `Only 3 days left for ${title}! Kindly confirm your RSVP:` },
    { label: "1 day to go", msg: `Tomorrow's the big day — ${title}! Last chance to RSVP:` },
  ];

  return (
    <div className="rounded-2xl border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-bold text-ink">Share &amp; remind</h3>

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          onFocus={(e) => e.currentTarget.select()}
          className="flex-1 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-600"
        />
        <button
          onClick={copy}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>

      <p className="mt-4 text-sm font-medium text-gray-700">
        Send on WhatsApp:
      </p>
      <div className="mt-2 flex flex-wrap gap-2">
        {REMINDERS.map((r) => (
          <a
            key={r.label}
            href={wa(r.msg)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-[#25D366] px-4 py-1.5 text-sm font-medium text-[#1a9c4e] transition hover:bg-[#25D366]/10"
          >
            {r.label}
          </a>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">
        Tip: broadcast these in your WhatsApp groups. Automated scheduled
        reminders activate once a WhatsApp/email sender is connected.
      </p>
    </div>
  );
}
