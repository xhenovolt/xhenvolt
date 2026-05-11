import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { retrieveAnswer, buildSuggestedActions } from "@/lib/ai/retrieval";
import { logConversation, getSetting } from "@/lib/repositories";
import { createHash, randomUUID } from "node:crypto";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const chatInput = z.object({
  message: z.string().trim().min(1).max(2000),
  context: z.unknown().optional(),
  systemPrompt: z.string().optional(),
  conversationHistory: z.array(z.unknown()).optional(),
  sessionId: z.string().trim().max(80).optional(),
});

interface AiAssistantSetting {
  name?: string;
  fallbackMessage?: string;
  suggestions?: string[];
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
  let parsed: z.infer<typeof chatInput>;
  try {
    parsed = chatInput.parse(await req.json());
  } catch {
    return NextResponse.json(
      { error: "invalid_request", answer: DEFAULT_FALLBACK, confidence: 0 },
      { status: 400 },
    );
  }

  const cfg = await getSetting<AiAssistantSetting>("ai_assistant", {});
  const fallbackMessage = cfg.fallbackMessage ?? DEFAULT_FALLBACK;
  const sessionId = parsed.sessionId ?? randomUUID();
  const userAgent = req.headers.get("user-agent") ?? undefined;
  const ipHash = hashIp(req);

  let result;
  try {
    result = await retrieveAnswer(parsed.message, fallbackMessage);
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[api/chat] retrieval failed:", err);
    }
    result = {
      answer: fallbackMessage,
      confidence: 0,
      source: "fallback" as const,
      matchedFaqIds: [],
      matchedDocIds: [],
    };
  }

  const latencyMs = Date.now() - t0;

  // Best-effort logging; do not block response.
  Promise.all([
    logConversation({
      sessionId,
      role: "user",
      message: parsed.message,
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
    model: "xhenvolt-ai-retrieval-v1",
    latencyMs,
  });
}
