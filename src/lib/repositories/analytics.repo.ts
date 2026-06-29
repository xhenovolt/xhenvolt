import { and, gte, eq, desc, sql, count, countDistinct } from "drizzle-orm";
import type { MySqlColumn } from "drizzle-orm/mysql-core";
import { db, schema } from "@/lib/db";

/**
 * Admin analytics aggregations. Read directly (admin pages are force-dynamic
 * and want fresh data) with per-call try/catch fallbacks so a DB blip never
 * crashes the dashboard.
 */

const PV = schema.analyticsPageViews;
const EV = schema.analyticsEvents;
const CC = schema.cookieConsents;
const DL = schema.downloadEvents;

export function sinceDays(days: number): Date {
  return new Date(Date.now() - days * 86_400_000);
}

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  if (!db) return fallback;
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export interface Overview {
  pageViews: number;
  uniqueVisitors: number;
  humanViews: number;
  botViews: number;
  aiCrawlerViews: number;
  downloads: number;
  events: number;
  consentAcceptRate: number | null;
}

export async function getOverview(days: number): Promise<Overview> {
  return safe(async () => {
    const since = sinceDays(days);
    const [pv] = await db!
      .select({
        total: count(),
        uniq: countDistinct(PV.visitorId),
        human: sql<number>`SUM(CASE WHEN ${PV.isBot} = false THEN 1 ELSE 0 END)`,
        bot: sql<number>`SUM(CASE WHEN ${PV.isBot} = true THEN 1 ELSE 0 END)`,
        ai: sql<number>`SUM(CASE WHEN ${PV.isAiCrawler} = true THEN 1 ELSE 0 END)`,
      })
      .from(PV)
      .where(gte(PV.createdAt, since));
    const [ev] = await db!.select({ c: count() }).from(EV).where(gte(EV.createdAt, since));
    const [dl] = await db!.select({ c: count() }).from(DL).where(gte(DL.createdAt, since));
    const [cc] = await db!
      .select({
        total: count(),
        accepted: sql<number>`SUM(CASE WHEN ${CC.analytics} = true THEN 1 ELSE 0 END)`,
      })
      .from(CC);

    const consentTotal = Number(cc?.total ?? 0);
    return {
      pageViews: Number(pv?.total ?? 0),
      uniqueVisitors: Number(pv?.uniq ?? 0),
      humanViews: Number(pv?.human ?? 0),
      botViews: Number(pv?.bot ?? 0),
      aiCrawlerViews: Number(pv?.ai ?? 0),
      downloads: Number(dl?.c ?? 0),
      events: Number(ev?.c ?? 0),
      consentAcceptRate: consentTotal > 0 ? Number(cc?.accepted ?? 0) / consentTotal : null,
    };
  }, {
    pageViews: 0, uniqueVisitors: 0, humanViews: 0, botViews: 0,
    aiCrawlerViews: 0, downloads: 0, events: 0, consentAcceptRate: null,
  });
}

export interface DayPoint { date: string; views: number; visitors: number }

export async function getTrend(days: number): Promise<DayPoint[]> {
  return safe(async () => {
    const since = sinceDays(days);
    const rows = await db!
      .select({
        date: sql<string>`DATE(${PV.createdAt})`,
        views: count(),
        visitors: countDistinct(PV.visitorId),
      })
      .from(PV)
      .where(and(gte(PV.createdAt, since), eq(PV.isBot, false)))
      .groupBy(sql`DATE(${PV.createdAt})`)
      .orderBy(sql`DATE(${PV.createdAt})`);
    return rows.map((r) => ({ date: String(r.date), views: Number(r.views), visitors: Number(r.visitors) }));
  }, []);
}

export interface Counted { label: string; value: number }

async function groupCount(
  column: MySqlColumn,
  days: number,
  opts: { humansOnly?: boolean; limit?: number } = {},
): Promise<Counted[]> {
  return safe(async () => {
    const conds = [gte(PV.createdAt, sinceDays(days))];
    if (opts.humansOnly) conds.push(eq(PV.isBot, false));
    const rows = await db!
      .select({ label: column, value: count() })
      .from(PV)
      .where(and(...conds))
      .groupBy(column)
      .orderBy(desc(count()))
      .limit(opts.limit ?? 25);
    return rows
      .map((r) => ({ label: (r.label as string | null) ?? "(unknown)", value: Number(r.value) }))
      .filter((r) => r.value > 0);
  }, []);
}

export const getTopPages = (days: number) => groupCount(PV.path, days, { humansOnly: true, limit: 20 });
export const getDevices = (days: number) => groupCount(PV.deviceType, days, { humansOnly: true });
export const getBrowsers = (days: number) => groupCount(PV.browser, days, { humansOnly: true });
export const getOperatingSystems = (days: number) => groupCount(PV.os, days, { humansOnly: true });
export const getCountries = (days: number) => groupCount(PV.country, days, { humansOnly: true });

export async function getTopSources(days: number): Promise<Counted[]> {
  return safe(async () => {
    const rows = await db!
      .select({ label: PV.source, value: count() })
      .from(PV)
      .where(and(gte(PV.createdAt, sinceDays(days)), eq(PV.isBot, false)))
      .groupBy(PV.source)
      .orderBy(desc(count()))
      .limit(20);
    return rows.map((r) => ({ label: r.label ?? "direct", value: Number(r.value) })).filter((r) => r.value > 0);
  }, []);
}

export interface BotRow { name: string; views: number; isAi: boolean }

export async function getBots(days: number): Promise<BotRow[]> {
  return safe(async () => {
    const rows = await db!
      .select({
        name: PV.botName,
        ai: sql<number>`MAX(CASE WHEN ${PV.isAiCrawler} = true THEN 1 ELSE 0 END)`,
        views: count(),
      })
      .from(PV)
      .where(and(gte(PV.createdAt, sinceDays(days)), eq(PV.isBot, true)))
      .groupBy(PV.botName)
      .orderBy(desc(count()))
      .limit(50);
    return rows.map((r) => ({ name: r.name ?? "(unknown)", views: Number(r.views), isAi: Number(r.ai) === 1 }));
  }, []);
}

export interface DownloadRow { slug: string; platform: string | null; version: string | null; count: number }

export async function getDownloads(days: number): Promise<DownloadRow[]> {
  return safe(async () => {
    const rows = await db!
      .select({ slug: DL.slug, platform: DL.platform, version: DL.version, c: count() })
      .from(DL)
      .where(gte(DL.createdAt, sinceDays(days)))
      .groupBy(DL.slug, DL.platform, DL.version)
      .orderBy(desc(count()))
      .limit(50);
    return rows.map((r) => ({ slug: r.slug, platform: r.platform, version: r.version, count: Number(r.c) }));
  }, []);
}

export async function getTopEvents(days: number): Promise<Counted[]> {
  return safe(async () => {
    const rows = await db!
      .select({ label: EV.eventName, value: count() })
      .from(EV)
      .where(gte(EV.createdAt, sinceDays(days)))
      .groupBy(EV.eventName)
      .orderBy(desc(count()))
      .limit(25);
    return rows.map((r) => ({ label: r.label, value: Number(r.value) }));
  }, []);
}

export type RecentEvent = typeof schema.analyticsEvents.$inferSelect;
export async function getRecentEvents(limit = 100): Promise<RecentEvent[]> {
  return safe(() => db!.select().from(EV).orderBy(desc(EV.createdAt)).limit(limit), []);
}

export type RecentBotHit = typeof schema.analyticsPageViews.$inferSelect;
export async function getRecentBotHits(limit = 100): Promise<RecentBotHit[]> {
  return safe(
    () => db!.select().from(PV).where(eq(PV.isBot, true)).orderBy(desc(PV.createdAt)).limit(limit),
    [],
  );
}

export interface ConsentStats {
  total: number;
  analyticsGranted: number;
  marketingGranted: number;
  preferencesGranted: number;
  acceptRate: number | null;
}

export async function getConsentStats(): Promise<ConsentStats> {
  return safe(async () => {
    const [r] = await db!
      .select({
        total: count(),
        a: sql<number>`SUM(CASE WHEN ${CC.analytics} = true THEN 1 ELSE 0 END)`,
        m: sql<number>`SUM(CASE WHEN ${CC.marketing} = true THEN 1 ELSE 0 END)`,
        p: sql<number>`SUM(CASE WHEN ${CC.preferences} = true THEN 1 ELSE 0 END)`,
      })
      .from(CC);
    const total = Number(r?.total ?? 0);
    return {
      total,
      analyticsGranted: Number(r?.a ?? 0),
      marketingGranted: Number(r?.m ?? 0),
      preferencesGranted: Number(r?.p ?? 0),
      acceptRate: total > 0 ? Number(r?.a ?? 0) / total : null,
    };
  }, { total: 0, analyticsGranted: 0, marketingGranted: 0, preferencesGranted: 0, acceptRate: null });
}
