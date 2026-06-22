"use client";

import { forwardRef } from "react";
import type { InvitationCopy, ThemeDef, InvitationInput } from "@/lib/ai-invite";

interface Props {
  copy: InvitationCopy;
  theme: ThemeDef;
  details: Pick<InvitationInput, "date" | "time" | "venue">;
}

// The rendered invitation. Pure CSS/text (no external images) so it exports to
// PNG cleanly via html-to-image. `forwardRef` exposes the node for capture.
const InvitationCard = forwardRef<HTMLDivElement, Props>(function InvitationCard(
  { copy, theme, details },
  ref
) {
  return (
    <div
      ref={ref}
      style={{ background: theme.bg }}
      className="mx-auto w-full max-w-[420px] rounded-2xl p-4 shadow-2xl sm:p-5"
    >
      <div
        style={{
          background: theme.panel,
          borderColor: theme.accent,
          color: theme.ink,
        }}
        className="rounded-xl border px-6 py-9 text-center"
      >
        <div
          style={{ color: theme.accent }}
          className="text-lg tracking-[0.35em]"
        >
          {theme.motif}
        </div>

        <p
          style={{ color: theme.muted }}
          className="mt-5 text-[11px] font-medium uppercase tracking-[0.28em]"
        >
          {copy.eyebrow}
        </p>

        <h2
          className="font-display mt-4 text-3xl font-bold leading-tight sm:text-4xl"
          style={{ color: theme.ink }}
        >
          {copy.names}
        </h2>

        <div
          className="mx-auto my-4 h-px w-20"
          style={{ background: theme.accent }}
        />

        <p
          style={{ color: theme.accent }}
          className="font-display text-base font-semibold uppercase tracking-[0.2em]"
        >
          {copy.headline}
        </p>

        <p
          style={{ color: theme.muted }}
          className="mx-auto mt-4 max-w-[300px] text-sm leading-relaxed"
        >
          {copy.invite}.
        </p>

        {(details.date || details.time || details.venue) && (
          <div
            className="mx-auto mt-6 flex max-w-[320px] flex-col items-center gap-1 text-sm"
            style={{ color: theme.ink }}
          >
            {details.date && (
              <span className="font-semibold tracking-wide">{details.date}</span>
            )}
            {details.time && <span>{details.time}</span>}
            {details.venue && (
              <span style={{ color: theme.muted }} className="mt-0.5">
                {details.venue}
              </span>
            )}
          </div>
        )}

        <p
          style={{ color: theme.muted }}
          className="mt-6 text-xs italic"
        >
          {copy.closing}
        </p>

        <div
          style={{ color: theme.accent }}
          className="mt-5 text-sm tracking-[0.35em]"
        >
          {theme.motif}
        </div>
      </div>
    </div>
  );
});

export default InvitationCard;
