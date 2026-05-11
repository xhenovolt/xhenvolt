import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { retrieveAnswer, buildSuggestedActions } from "@/lib/ai/retrieval";
import { logConversation, getSetting } from "@/lib/repositories";
import { createHash, randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const askInput = z.object({
  question: z.string().trim().min(1).max(2000),
  context: z.array(z.unknown()).optional(),
  sessionId: z.string().trim().max(80).optional(),
});

interface AiAssistantSetting {
  fallbackMessage?: string;
}

const DEFAULT_FALLBACK =
  "I don't have that one yet — but a human teammate does. WhatsApp +256 741 341 483 and we'll reply in minutes.";

function hashIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || "0.0.0.0";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

export async function POST(req: NextRequest) {
  const t0 = Date.now();
  let parsed: z.infer<typeof askInput>;
  try {
    parsed = askInput.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "Question is required", answer: DEFAULT_FALLBACK },
      { status: 400 },
    );
  }

  const cfg = await getSetting<AiAssistantSetting>("ai_assistant", {});
  const fallbackMessage = cfg.fallbackMessage ?? DEFAULT_FALLBACK;
  const sessionId = parsed.sessionId ?? randomUUID();
  const ipHash = hashIp(req);
  const userAgent = req.headers.get("user-agent") ?? undefined;

  const result = await retrieveAnswer(parsed.question, fallbackMessage);
  const latencyMs = Date.now() - t0;

  Promise.all([
    logConversation({
      sessionId,
      role: "user",
      message: parsed.question,
      userAgent,
      ipHash,
    }),
    logConversation({
      sessionId,
      role: "assistant",
      message: result.answer,
      matchedFaqIds: result.matchedFaqIds,
      matchedDocIds: result.matchedDocIds,
      confidence: Math.round(result.confidence * 100),
      latencyMs,
    }),
  ]).catch(() => {});

  return NextResponse.json({
    answer: result.answer,
    confidence: result.confidence,
    source: result.source,
    suggestedActions: buildSuggestedActions(result.source),
    sessionId,
    latencyMs,
  });
}
