import "server-only";
import {
  generateWording,
  type InvitationInput,
  type InvitationCopy,
} from "@/lib/ai-invite";

// Single entry point for invitation-copy generation.
//
// - No ANTHROPIC_API_KEY  -> local generator (instant, free, offline).
// - ANTHROPIC_API_KEY set -> real Claude generation, with the local generator
//   as an automatic fallback if the API call fails.
//
// To go live later: add ANTHROPIC_API_KEY (and optionally AI_INVITE_MODEL) to
// the environment. No other code changes are required.
export async function generateInvitationCopy(
  input: InvitationInput,
  variant = 0.42
): Promise<{ copy: InvitationCopy; source: "claude" | "local" }> {
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const { generateWithClaude } = await import("@/lib/ai/claude");
      const copy = await generateWithClaude(input, variant);
      return { copy, source: "claude" };
    } catch (e) {
      // Never fail the request because the model is down — fall back locally.
      console.error("[ai] Claude generation failed, using local fallback:", e);
    }
  }
  return { copy: generateWording(input, variant), source: "local" };
}
