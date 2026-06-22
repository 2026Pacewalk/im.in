import { generateInvitationCopy } from "@/lib/ai/provider";
import type { InvitationInput } from "@/lib/ai-invite";

export const dynamic = "force-dynamic";

// POST { input: InvitationInput, variant?: number } -> InvitationCopy
//
// Routing lives in lib/ai/provider.ts: local generator by default, real Claude
// generation once ANTHROPIC_API_KEY is set. The response shape is identical
// either way, so the frontend never changes.
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      input?: InvitationInput;
      variant?: number;
    };
    if (!body?.input?.occasion || !body.input.tone) {
      return Response.json({ error: "Missing occasion or tone." }, { status: 400 });
    }
    const { copy, source } = await generateInvitationCopy(body.input, body.variant);
    return Response.json(copy, { headers: { "X-AI-Source": source } });
  } catch (e) {
    return Response.json(
      { error: e instanceof Error ? e.message : "Generation failed" },
      { status: 500 }
    );
  }
}
