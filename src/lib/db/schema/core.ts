import {
  mysqlTable,
  varchar,
  text,
  json,
  index,
  uniqueIndex,
  int,
} from "drizzle-orm/mysql-core";
import { id, createdAt, updatedAt, deletedAt, sortOrder } from "./_shared";

export const settings = mysqlTable(
  "settings",
  {
    id: id(),
    key: varchar("key", { length: 100 }).notNull().unique(),
    value: json("value").notNull(),
    description: text("description"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("settings_key_idx").on(t.key)],
);

export const mediaAssets = mysqlTable(
  "media_assets",
  {
    id: id(),
    url: varchar("url", { length: 500 }).notNull(),
    publicPath: varchar("public_path", { length: 500 }),
    alt: varchar("alt", { length: 500 }).notNull().default(""),
    title: varchar("title", { length: 200 }),
    mimeType: varchar("mime_type", { length: 80 }),
    width: int("width"),
    height: int("height"),
    sizeBytes: int("size_bytes"),
    metadata: json("metadata"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [index("media_url_idx").on(t.url)],
);

export const categories = mysqlTable(
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

export const tags = mysqlTable(
  "tags",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    createdAt: createdAt(),
  },
  (t) => [uniqueIndex("tags_slug_uq").on(t.slug)],
);
