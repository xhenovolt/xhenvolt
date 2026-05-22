import {
  mysqlTable,
  varchar,
  text,
  json,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const pages = mysqlTable(
  "pages",
  {
    id: id(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    route: varchar("route", { length: 200 }).notNull(),
    summary: text("summary"),
    status: varchar("status", { length: 20 }).notNull().default("published"),
    published: published(),
    metadata: json("metadata"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("pages_slug_uq").on(t.slug),
    index("pages_route_idx").on(t.route),
  ],
);

export const sections = mysqlTable(
  "sections",
  {
    id: id(),
    pageId: varchar("page_id", { length: 36 })
      .references(() => pages.id, { onDelete: "cascade" })
      .notNull(),
    key: varchar("key", { length: 120 }).notNull(),
    kind: varchar("kind", { length: 80 }).notNull(),
    title: varchar("title", { length: 240 }),
    subtitle: text("subtitle"),
    body: text("body"),
    content: json("content"),
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

export const seoMetadata = mysqlTable(
  "seo_metadata",
  {
    id: id(),
    route: varchar("route", { length: 200 }).notNull().unique(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    keywords: text("keywords"),
    canonical: varchar("canonical", { length: 500 }),
    ogTitle: varchar("og_title", { length: 200 }),
    ogDescription: text("og_description"),
    ogImage: varchar("og_image", { length: 500 }),
    ogType: varchar("og_type", { length: 40 }).default("website"),
    twitterCard: varchar("twitter_card", { length: 40 }).default(
      "summary_large_image",
    ),
    robots: json("robots"),
    structuredData: json("structured_data"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("seo_route_uq").on(t.route)],
);
