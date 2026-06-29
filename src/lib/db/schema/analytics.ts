import {
  mysqlTable,
  varchar,
  text,
  json,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { id, createdAt, updatedAt } from "./_shared";

/**
 * Xhenvolt first-party analytics.
 *
 * Privacy posture (see PRIVACY_NOTES.md):
 *  - No raw IPs. Only a daily-salted SHA-256 ipHash.
 *  - visitorId / sessionId are first-party random IDs minted ONLY after the
 *    visitor grants the "analytics" consent category. Before consent, human
 *    pageviews are not recorded.
 *  - Bot / AI-crawler hits are recorded server-side (they don't run JS and set
 *    no cookies) for business intelligence — no personal data involved.
 *
 * Downloads are NOT duplicated here: they already live in `download_events`
 * (see schema/cosmos.ts), which the analytics dashboard reads.
 */

export const analyticsPageViews = mysqlTable(
  "analytics_page_views",
  {
    id: id(),
    path: varchar("path", { length: 300 }).notNull(),
    title: varchar("title", { length: 300 }),
    referrer: varchar("referrer", { length: 500 }),
    source: varchar("source", { length: 120 }),
    medium: varchar("medium", { length: 120 }),
    campaign: varchar("campaign", { length: 120 }),
    userAgent: varchar("user_agent", { length: 500 }),
    deviceType: varchar("device_type", { length: 20 }),
    browser: varchar("browser", { length: 60 }),
    os: varchar("os", { length: 60 }),
    country: varchar("country", { length: 80 }),
    city: varchar("city", { length: 120 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    sessionId: varchar("session_id", { length: 64 }),
    visitorId: varchar("visitor_id", { length: 64 }),
    isBot: boolean("is_bot").notNull().default(false),
    botName: varchar("bot_name", { length: 80 }),
    isAiCrawler: boolean("is_ai_crawler").notNull().default(false),
    aiCrawlerName: varchar("ai_crawler_name", { length: 80 }),
    createdAt: createdAt(),
  },
  (t) => [
    index("apv_path_idx").on(t.path),
    index("apv_created_idx").on(t.createdAt),
    index("apv_visitor_idx").on(t.visitorId),
    index("apv_session_idx").on(t.sessionId),
    index("apv_bot_idx").on(t.isBot),
    index("apv_ai_idx").on(t.isAiCrawler),
  ],
);

export const analyticsEvents = mysqlTable(
  "analytics_events",
  {
    id: id(),
    eventType: varchar("event_type", { length: 40 }).notNull(),
    eventName: varchar("event_name", { length: 120 }).notNull(),
    path: varchar("path", { length: 300 }),
    target: varchar("target", { length: 500 }),
    metadata: json("metadata"),
    sessionId: varchar("session_id", { length: 64 }),
    visitorId: varchar("visitor_id", { length: 64 }),
    createdAt: createdAt(),
  },
  (t) => [
    index("aev_type_idx").on(t.eventType),
    index("aev_name_idx").on(t.eventName),
    index("aev_created_idx").on(t.createdAt),
  ],
);

export const cookieConsents = mysqlTable(
  "cookie_consents",
  {
    id: id(),
    visitorId: varchar("visitor_id", { length: 64 }).notNull(),
    necessary: boolean("necessary").notNull().default(true),
    analytics: boolean("analytics").notNull().default(false),
    marketing: boolean("marketing").notNull().default(false),
    preferences: boolean("preferences").notNull().default(false),
    consentVersion: varchar("consent_version", { length: 20 }).notNull(),
    userAgent: varchar("user_agent", { length: 500 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("cc_visitor_idx").on(t.visitorId),
    index("cc_created_idx").on(t.createdAt),
  ],
);

// Optional aggregation table — foundation for a future daily rollup job.
// Left unused for now; the dashboard computes on the fly over indexed columns.
export const analyticsDailySummary = mysqlTable(
  "analytics_daily_summary",
  {
    id: id(),
    date: varchar("date", { length: 10 }).notNull(), // YYYY-MM-DD
    pageViews: varchar("page_views", { length: 20 }),
    uniqueVisitors: varchar("unique_visitors", { length: 20 }),
    downloads: varchar("downloads", { length: 20 }),
    topPages: json("top_pages"),
    topSources: json("top_sources"),
    devices: json("devices"),
    bots: json("bots"),
    aiCrawlers: json("ai_crawlers"),
    createdAt: createdAt(),
  },
  (t) => [index("ads_date_idx").on(t.date)],
);
