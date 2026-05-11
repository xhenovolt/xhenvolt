import {
  pgTable,
  varchar,
  text,
  jsonb,
  index,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const pages = pgTable(
  "pages",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    route: varchar("route", { length: 200 }).notNull(),
    summary: text("summary"),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    published: published(),
    metadata: jsonb("metadata"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("pages_slug_uq").on(t.slug),
    index("pages_route_idx").on(t.route),
  ],
);

export const sections = pgTable(
  "sections",
  {
    id: id(),
    pageId: uuid("page_id")
      .references(() => pages.id, { onDelete: "cascade" })
      .notNull(),
    key: varchar("key", { length: 120 }).notNull(),
    kind: varchar("kind", { length: 80 }).notNull(),
    title: varchar("title", { length: 240 }),
    subtitle: text("subtitle"),
    body: text("body"),
    content: jsonb("content"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index("sections_page_idx").on(t.pageId),
    uniqueIndex("sections_page_key_uq").on(t.pageId, t.key),
  ],
);

export const seoMetadata = pgTable(
  "seo_metadata",
  {
    id: id(),
    route: varchar("route", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    keywords: text("keywords"),
    canonical: text("canonical"),
    ogTitle: varchar("og_title", { length: 200 }),
    ogDescription: text("og_description"),
    ogImage: text("og_image"),
    ogType: varchar("og_type", { length: 40 }).default("website"),
    twitterCard: varchar("twitter_card", { length: 40 }).default(
      "summary_large_image",
    ),
    robots: jsonb("robots"),
    structuredData: jsonb("structured_data"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("seo_route_uq").on(t.route)],
);
