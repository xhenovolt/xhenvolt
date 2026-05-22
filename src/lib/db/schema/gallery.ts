import {
  mysqlTable,
  varchar,
  text,
  index,
} from "drizzle-orm/mysql-core";
import { mediaAssets } from "./core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const galleryImages = mysqlTable(
  "gallery_images",
  {
    id: id(),
    title: varchar("title", { length: 200 }),
    caption: text("caption"),
    mediaId: varchar("media_id", { length: 36 }).references(
      () => mediaAssets.id,
      { onDelete: "cascade" },
    ),
    imageUrl: varchar("image_url", { length: 500 }).notNull(),
    alt: varchar("alt", { length: 500 }).notNull().default(""),
    collection: varchar("collection", { length: 120 }).default("default"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("gallery_collection_idx").on(t.collection)],
);
