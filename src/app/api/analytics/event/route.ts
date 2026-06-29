import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { clientIpFromHeaders, hashIp, clamp, cleanPath } from "@/lib/analytics/server";

/**
 * First-party custom-event ingestion (CTA clicks, outbound links, form
 * submits, etc). Consent-gated on the client. Fail-soft (204 on any error).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bucket = new Map<string, { n: number; reset: number }>();
const LIMIT = 120;
const WINDOW = 60_000;
function limited(key: string): boolean {
  const now = Date.now();
  const b = bucket.get(key);
  if (!b || b.reset < now) {
    bucket.set(key, { n: 1, reset: now + WINDOW });
    return false;
  }
  if (b.n >= LIMIT) return true;
  b.n++;
  return false;
}

const ALLOWED_TYPES = new Set(["cta", "outbound", "form", "download", "nav", "custom"]);

export async function POST(req: NextRequest) {
  try {
    const ipHash = hashIp(clientIpFromHeaders(req.headers));
    if (ipHash && limited(ipHash)) return new NextResponse(null, { status: 204 });

    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const eventName = clamp(body.eventName, 120);
    if (!eventName || !db) return new NextResponse(null, { status: 204 });

    const typeRaw = clamp(body.eventType, 40) ?? "custom";
    const eventType = ALLOWED_TYPES.has(typeRaw) ? typeRaw : "custom";

    // Bound the metadata size to prevent payload-injection abuse.
    let metadata: unknown = null;
    if (body.metadata && typeof body.metadata === "object") {
      const json = JSON.stringify(body.metadata);
      if (json.length <= 2000) metadata = body.metadata;
    }

    await db.insert(schema.analyticsEvents).values({
      eventType,
      eventName,
      path: cleanPath(body.path),
      target: clamp(body.target, 500),
      metadata,
      sessionId: clamp(body.sessionId, 64),
      visitorId: clamp(body.visitorId, 64),
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[analytics/event]", err);
    return new NextResponse(null, { status: 204 });
  }
}
