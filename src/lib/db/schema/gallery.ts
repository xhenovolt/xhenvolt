import {
  pgTable,
  varchar,
  text,
  index,
  uuid,
} from "drizzle-orm/pg-core";
import { mediaAssets } from "./core";
import {
  id,
  createdAt,
  updatedAt,
  published,
  sortOrder,
} from "./_shared";

export const galleryImages = pgTable(
  "gallery_images",
  {
    id: id(),
    title: varchar("title", { length: 200 }),
    caption: text("caption"),
    mediaId: uuid("media_id").references(() => mediaAssets.id, {
      onDelete: "cascade",
    }),
    imageUrl: text("image_url").notNull(),
    alt: text("alt").notNull().default(""),
    collection: varchar("collection", { length: 120 }).default("default"),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index("gallery_collection_idx").on(t.collection)],
);
