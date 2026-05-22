import {
  mysqlTable,
  varchar,
  text,
  index,
  json,
  timestamp,
  boolean,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const heroSlides = mysqlTable(
  "hero_slides",
  {
    id: id(),
    scope: varchar("scope", { length: 60 }).notNull().default("home"),
    eyebrow: varchar("eyebrow", { length: 160 }),
    headline: varchar("headline", { length: 240 }).notNull(),
    subheadline: text("subheadline"),
    ctaPrimaryLabel: varchar("cta_primary_label", { length: 80 }),
    ctaPrimaryHref: varchar("cta_primary_href", { length: 240 }),
    ctaSecondaryLabel: varchar("cta_secondary_label", { length: 80 }),
    ctaSecondaryHref: varchar("cta_secondary_href", { length: 240 }),
    backgroundUrl: varchar("background_url", { length: 500 }),
    media: json("media"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("hero_scope_idx").on(t.scope)],
);

export const announcements = mysqlTable("announcements", {
  id: id(),
  title: varchar("title", { length: 200 }).notNull(),
  message: text("message").notNull(),
  severity: varchar("severity", { length: 20 }).notNull().default("info"),
  href: varchar("href", { length: 240 }),
  dismissible: boolean("dismissible").notNull().default(true),
  startsAt: timestamp("starts_at", { fsp: 3 }),
  endsAt: timestamp("ends_at", { fsp: 3 }),
  published: published(),
  sortOrder: sortOrder(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});
