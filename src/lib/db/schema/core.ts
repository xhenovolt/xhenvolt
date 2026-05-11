import { sql } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  jsonb,
  index,
  uniqueIndex,
  integer,
} from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt, deletedAt, sortOrder } from "./_shared";

export const settings = pgTable(
  "settings",
  {
    id: id(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: jsonb("value").notNull(),
    description: text("description"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("settings_key_idx").on(t.key)],
);

export const mediaAssets = pgTable(
  "media_assets",
  {
    id: id(),
    url: text("url").notNull(),
    publicPath: text("public_path"),
    alt: text("alt").notNull().default(""),
    title: varchar("title", { length: 200 }),
    mimeType: varchar("mime_type", { length: 80 }),
    width: integer("width"),
    height: integer("height"),
    sizeBytes: integer("size_bytes"),
    metadata: jsonb("metadata"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [index("media_url_idx").on(t.url)],
);

export const categories = pgTable(
  "categories",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    description: text("description"),
    sortOrder: sortOrder(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("categories_slug_uq").on(t.slug)],
);

export const tags = pgTable(
  "tags",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("tags_slug_uq").on(t.slug)],
);
