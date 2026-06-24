import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { z } from "zod";
import { sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";

/**
 * Newsletter / "stay updated" subscriptions.
 *
 * There is no dedicated subscribers table yet, so signups are stored as
 * `contact_messages` rows with source="newsletter". This surfaces them in the
 * existing admin Inbox (/admin/messages) and keeps the data real — no fake
 * success. When a dedicated subscribers model is added later, migrate these.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateBucket = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimit(key: string): boolean {
  const now = Date.now();
  const bucket = rateBucket.get(key);
  if (!bucket || bucket.resetAt < now) {
    rateBucket.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT) return false;
  bucket.count += 1;
  return true;
}

function hashIp(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for") ?? "";
  const ip = fwd.split(",")[0].trim() || "0.0.0.0";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

const subscribeInput = z.object({
  name: z.string().trim().max(200).optional().default(""),
  email: z.string().trim().email("A valid email is required.").max(240),
  interests: z.array(z.string().trim().max(80)).max(20).optional().default([]),
});

export async function POST(req: NextRequest) {
  const ipHash = hashIp(req);
  if (!rateLimit(ipHash)) {
    return NextResponse.json(
      { error: "rate_limited", message: "Too many requests. Try again shortly." },
      { status: 429 },
    );
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = subscribeInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!db) {
    return NextResponse.json(
      { error: "service_unavailable", message: "Subscriptions are temporarily offline." },
      { status: 503 },
    );
  }

  const { name, email, interests } = parsed.data;
  const normalizedEmail = email.toLowerCase();
  try {
    // Upsert on the unique email: a repeat signup refreshes interests and
    // re-subscribes (status back to "subscribed") instead of duplicating.
    await db
      .insert(schema.subscribers)
      .values({
        id: randomUUID(),
        email: normalizedEmail,
        name: name || null,
        status: "subscribed",
        interests,
        source: "newsletter",
        userAgent: req.headers.get("user-agent") ?? null,
        ipHash,
      })
      .onDuplicateKeyUpdate({
        set: {
          name: name || null,
          interests,
          status: "subscribed",
          updatedAt: sql`CURRENT_TIMESTAMP(3)`,
        },
      });
    return NextResponse.json(
      { ok: true, message: "You're subscribed — thanks for joining the Xhenvolt list." },
      { status: 201 },
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[api/newsletter] insert failed:", err);
    }
    return NextResponse.json(
      { error: "persist_failed", message: "We couldn't save your subscription. Please try again." },
      { status: 500 },
    );
  }
}
