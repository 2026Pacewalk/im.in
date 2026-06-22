import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import type { InvitationInput, InvitationCopy } from "@/lib/ai-invite";

// Real Claude-backed wording generation. Activated automatically once
// ANTHROPIC_API_KEY is set (see ./provider.ts). Model is overridable via
// AI_INVITE_MODEL — defaults to Claude Opus 4.8. For a cheaper/faster option on
// this short task you can set AI_INVITE_MODEL=claude-haiku-4-5.
const MODEL = process.env.AI_INVITE_MODEL || "claude-opus-4-8";

// Structured-output schema → guarantees the model returns exactly InvitationCopy.
const SCHEMA = {
  type: "object",
  properties: {
    eyebrow: { type: "string" },
    headline: { type: "string" },
    names: { type: "string" },
    invite: { type: "string" },
    closing: { type: "string" },
  },
  required: ["eyebrow", "headline", "names", "invite", "closing"],
  additionalProperties: false,
} as const;

function buildPrompt(input: InvitationInput, variant: number): string {
  const lines = [
    `Write copy for a digital ${input.occasion} invitation card.`,
    `Tone: ${input.tone}.`,
    `Host name(s): ${input.hostNames || "the hosts"}.`,
    input.date ? `Date: ${input.date}.` : "",
    input.time ? `Time: ${input.time}.` : "",
    input.venue ? `Venue: ${input.venue}.` : "",
    input.extra ? `Also weave in: ${input.extra}.` : "",
    "",
    "Return these fields:",
    "- eyebrow: a short line above the names (max 6 words).",
    "- headline: the occasion line (max 5 words).",
    "- names: the host name(s), cleaned and nicely cased.",
    "- invite: one warm invitation sentence (no trailing period).",
    "- closing: a short sign-off (max 10 words).",
    `Keep it culturally appropriate for an Indian audience. Vary the wording (seed ${variant.toFixed(3)}).`,
  ];
  return lines.filter(Boolean).join("\n");
}

export async function generateWithClaude(
  input: InvitationInput,
  variant: number
): Promise<InvitationCopy> {
  const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    // Structured outputs constrain the response to the schema above.
    output_config: { format: { type: "json_schema", schema: SCHEMA } },
    messages: [{ role: "user", content: buildPrompt(input, variant) }],
    // Cast: output_config is newer than some @anthropic-ai/sdk type releases.
  } as Anthropic.MessageCreateParamsNonStreaming);

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") {
    throw new Error("Claude returned no text content");
  }
  return JSON.parse(text.text) as InvitationCopy;
}
