import { NextRequest, NextResponse } from "next/server";
import { eq, desc } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { clientIpFromHeaders, hashIp, clamp } from "@/lib/analytics/server";

/**
 * Cookie-consent ledger. The browser stores consent locally (cookie) for
 * gating; this endpoint records a server-side audit row so the CMS can show
 * acceptance stats. Latest row per visitorId wins.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export const CONSENT_VERSION = "1";

export async function POST(req: NextRequest) {
  try {
    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const visitorId = clamp(body.visitorId, 64);
    if (!visitorId || !db) return new NextResponse(null, { status: 204 });

    const toBool = (v: unknown) => v === true || v === "true";
    const ipHash = hashIp(clientIpFromHeaders(req.headers));
    const ua = clamp(req.headers.get("user-agent"), 500);

    const values = {
      visitorId,
      necessary: true, // always on
      analytics: toBool(body.analytics),
      marketing: toBool(body.marketing),
      preferences: toBool(body.preferences),
      consentVersion: clamp(body.consentVersion, 20) ?? CONSENT_VERSION,
      userAgent: ua,
      ipHash,
    };

    // Update the latest row for this visitor, else insert.
    const [existing] = await db
      .select({ id: schema.cookieConsents.id })
      .from(schema.cookieConsents)
      .where(eq(schema.cookieConsents.visitorId, visitorId))
      .orderBy(desc(schema.cookieConsents.createdAt))
      .limit(1);

    if (existing) {
      await db
        .update(schema.cookieConsents)
        .set({
          analytics: values.analytics,
          marketing: values.marketing,
          preferences: values.preferences,
          consentVersion: values.consentVersion,
        })
        .where(eq(schema.cookieConsents.id, existing.id));
    } else {
      await db.insert(schema.cookieConsents).values(values);
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[analytics/consent]", err);
    return new NextResponse(null, { status: 204 });
  }
}
