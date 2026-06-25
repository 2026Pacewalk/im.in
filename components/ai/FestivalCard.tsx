import type { Festival, FestivalGreeting, DesignId } from "@/lib/festival";

export default function FestivalCard({
  festival,
  greeting,
  design,
}: {
  festival: Festival;
  greeting: FestivalGreeting;
  design: DesignId;
}) {
  const t = festival.theme;

  return (
    <div
      style={{ background: t.bg }}
      className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden p-4 sm:p-6"
    >
      {/* Glow design: radial light behind the panel */}
      {design === "glow" && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 30%, ${t.accent}55, transparent 60%)`,
          }}
        />
      )}

      <div
        style={{
          background: t.panel,
          color: t.ink,
          ...(design === "ornate" ? { boxShadow: `inset 0 0 0 2px ${t.accent}` } : {}),
        }}
        className="relative flex h-full w-full flex-col items-center justify-center rounded-2xl px-6 py-8 text-center"
      >
        {/* Ornate corner frame */}
        {design === "ornate" && (
          <span
            className="pointer-events-none absolute inset-3 rounded-xl"
            style={{ border: `1px solid ${t.accent}66` }}
          />
        )}

        <div className="relative flex h-full flex-col items-center justify-center">
          <span className="text-5xl sm:text-6xl">{festival.emoji}</span>

          {design !== "minimal" && (
            <p
              className="mt-3 text-lg tracking-[0.3em]"
              style={{ color: t.accent }}
            >
              {t.motif}
            </p>
          )}

          <h3
            className="font-display mt-3 text-3xl font-bold leading-tight sm:text-4xl"
            style={{ color: t.ink }}
          >
            {greeting.headline}
          </h3>

          <span
            className="my-4 block h-px w-16"
            style={{ background: t.accent }}
          />

          <p
            className="max-w-sm text-sm leading-relaxed sm:text-base"
            style={{ color: t.muted }}
          >
            {greeting.body}
          </p>

          {greeting.sign && (
            <p
              className="font-display mt-4 text-lg font-semibold"
              style={{ color: t.ink }}
            >
              {greeting.sign}
            </p>
          )}

          <p className="mt-auto pt-6 text-[10px] uppercase tracking-[0.2em] opacity-60">
            Made free with InviteMart · invitemart.in
          </p>
        </div>
      </div>
    </div>
  );
}
