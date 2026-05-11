import {
  pgTable,
  varchar,
  text,
  index,
  jsonb,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const heroSlides = pgTable(
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
    backgroundUrl: text("background_url"),
    media: jsonb("media"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("hero_scope_idx").on(t.scope)],
);

export const announcements = pgTable(
  "announcements",
  {
    id: id(),
    title: varchar("title", { length: 200 }).notNull(),
    message: text("message").notNull(),
    severity: varchar("severity", { length: 20 }).notNull().default("info"),
    href: varchar("href", { length: 240 }),
    dismissible: boolean("dismissible").notNull().default(true),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    published: published(),
    sortOrder: sortOrder(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
);
