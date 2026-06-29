import { NextRequest, NextResponse } from "next/server";
import { db, schema } from "@/lib/db";
import { classifyUserAgent } from "@/lib/analytics/bots";
import { parseUserAgent, deriveSource } from "@/lib/analytics/ua";
import { hashIp, clamp, cleanPath } from "@/lib/analytics/server";

/**
 * Internal endpoint — called ONLY by middleware (event.waitUntil) to record a
 * bot / AI-crawler page hit server-side. Not meant for browsers.
 *
 * Guarded by a shared token header so it can't be trivially spammed from
 * outside. The real UA/IP/geo are forwarded by middleware via x-analytics-*
 * headers (the fetch itself originates from the Edge function).
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

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.ANALYTICS_INTERNAL_TOKEN ?? "internal";
    if (req.headers.get("x-analytics-token") !== expected) {
      return new NextResponse(null, { status: 204 });
    }

    const ua = req.headers.get("x-analytics-ua");
    const bot = classifyUserAgent(ua);
    if (!bot.isBot) return new NextResponse(null, { status: 204 });

    const ipRaw = req.headers.get("x-analytics-ip");
    const ip = ipRaw ? ipRaw.split(",")[0]!.trim() : null;
    const ipHash = hashIp(ip);
    if (ipHash && limited(ipHash)) return new NextResponse(null, { status: 204 });

    let body: Record<string, unknown> = {};
    try {
      body = (await req.json()) as Record<string, unknown>;
    } catch {
      /* tolerate empty body */
    }
    const path = cleanPath(body.path);
    if (!path || !db) return new NextResponse(null, { status: 204 });

    const { deviceType, browser, os } = parseUserAgent(ua);
    const referrer = clamp(body.referrer, 500);
    const { source, medium } = deriveSource(referrer);

    await db.insert(schema.analyticsPageViews).values({
      path,
      referrer,
      source,
      medium,
      userAgent: clamp(ua, 500),
      deviceType,
      browser,
      os,
      country: clamp(req.headers.get("x-analytics-country"), 80),
      city: clamp(req.headers.get("x-analytics-city"), 120),
      ipHash,
      isBot: true,
      botName: bot.botName,
      isAiCrawler: bot.isAiCrawler,
      aiCrawlerName: bot.aiCrawlerName,
    });

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") console.warn("[analytics/bot-hit]", err);
    return new NextResponse(null, { status: 204 });
  }
}
