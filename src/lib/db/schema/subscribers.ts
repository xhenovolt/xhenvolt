import {
  mysqlTable,
  varchar,
  text,
  json,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { id, createdAt, updatedAt } from "./_shared";

/**
 * Newsletter subscribers.
 *
 * Replaces the interim approach of storing signups as contact_messages
 * (source="newsletter"). Email is unique — repeat signups upsert (refresh
 * interests / re-subscribe) instead of duplicating. No raw IP is stored,
 * only a hash, matching the contact/newsletter privacy posture.
 */

export const SUBSCRIBER_STATUS = ["subscribed", "unsubscribed", "bounced"] as const;
export type SubscriberStatus = (typeof SUBSCRIBER_STATUS)[number];

export const subscribers = mysqlTable(
  "subscribers",
  {
    id: id(),
    email: varchar("email", { length: 240 }).notNull().unique(),
    name: varchar("name", { length: 200 }),
    status: varchar("status", { length: 20 }).notNull().default("subscribed"),
    interests: json("interests"),
    source: varchar("source", { length: 80 }).notNull().default("newsletter"),
    confirmedAt: timestamp("confirmed_at", { fsp: 3 }),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    uniqueIndex("subscribers_email_uq").on(t.email),
    index("subscribers_status_idx").on(t.status),
    index("subscribers_created_idx").on(t.createdAt),
  ],
);
