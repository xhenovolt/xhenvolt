import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { classifyUserAgent } from "@/lib/analytics/bots";
import { parseUserAgent, deriveSource } from "@/lib/analytics/ua";
import {
  clientIpFromHeaders,
  hashIp,
  geoFromHeaders,
  clamp,
  cleanPath,
} from "@/lib/analytics/server";

/**
 * First-party page-view ingestion. Called by the client AnalyticsProvider
 * ONLY after the visitor grants the "analytics" consent category.
 *
 * Fail-soft: any error returns 204 so the public site never sees an error.
 * The UA/bot/device fields are derived server-side from the real request
 * headers (not trusted from the client).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Lightweight in-memory rate limit per ipHash (best-effort; resets on cold start).
const bucket = new Map<string, { n: number; reset: number }>();
const LIMIT = 60;
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

export async function POST(req: NextRequest) {
  try {
    const ua = req.headers.get("user-agent");
    const ip = clientIpFromHeaders(req.headers);
    const ipHash = hashIp(ip);

    if (ipHash && limited(ipHash)) return new NextResponse(null, { status: 204 });

    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      return new NextResponse(null, { status: 204 });
    }

    const path = cleanPath(body.path);
    if (!path || !db) return new NextResponse(null, { status: 204 });

    const bot = classifyUserAgent(ua);
    const { deviceType, browser, os } = parseUserAgent(ua);
    const referrer = clamp(body.referrer, 500);
    const { source, medium } = deriveSource(referrer);
    const { country, city } = geoFromHeaders(req.headers);

    await db.insert(schema.analyticsPageViews).values({
      path,
      title: clamp(body.title, 300),
      referrer,
      source: clamp(body.source, 120) ?? source,
      medium: clamp(body.medium, 120) ?? medium,
      campaign: clamp(body.campaign, 120),
      userAgent: clamp(ua, 500),
      deviceType,
      browser,
      os,
      country,
      city,
      ipHash,
      sessionId: clamp(body.sessionId, 64),
      visitorId: clamp(body.visitorId, 64),
      isBot: bot.isBot,
      botName: bot.botName,
      isAiCrawler: bot.isAiCrawler,
      aiCrawlerName: bot.aiCrawlerName,
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[analytics/pageview]", err);
    return new NextResponse(null, { status: 204 });
  }
}
