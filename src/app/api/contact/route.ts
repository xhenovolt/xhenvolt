import { NextRequest, NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { db, schema } from "@/lib/db";
import { contactMessageInput } from "@/lib/validators/contact";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const rateBucket = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

function rateLimit(ipHash: string): boolean {
  const now = Date.now();
  const bucket = rateBucket.get(ipHash);
  if (!bucket || bucket.resetAt < now) {
    rateBucket.set(ipHash, { count: 1, resetAt: now + WINDOW_MS });
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

  const parsed = contactMessageInput.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_input", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!db) {
    return NextResponse.json(
      { error: "service_unavailable", message: "Submission queue is offline. WhatsApp +256 741 341 483." },
      { status: 503 },
    );
  }

  const userAgent = req.headers.get("user-agent") ?? null;
  try {
    const newId = randomUUID();
    await db.insert(schema.contactMessages).values({
      id: newId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone ?? null,
      subject: parsed.data.subject ?? null,
      message: parsed.data.message,
      source: parsed.data.source ?? "web",
      status: "new",
      userAgent,
      ipHash,
    });

    return NextResponse.json(
      {
        ok: true,
        id: newId,
        message: "Thanks — we received your message and will reply within a business day.",
      },
      { status: 201 },
    );
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[api/contact] insert failed:", err);
    }
    return NextResponse.json(
      { error: "persist_failed", message: "We couldn't save your message. Please WhatsApp us at +256 741 341 483." },
      { status: 500 },
    );
  }
}
