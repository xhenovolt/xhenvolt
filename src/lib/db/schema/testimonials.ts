import {
  mysqlTable,
  varchar,
  text,
  int,
  index,
  boolean,
} from "drizzle-orm/mysql-core";
import { systems } from "./systems";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const testimonials = mysqlTable(
  "testimonials",
  {
    id: id(),
    authorName: varchar("author_name", { length: 160 }).notNull(),
    authorRole: varchar("author_role", { length: 200 }),
    organization: varchar("organization", { length: 200 }),
    location: varchar("location", { length: 160 }),
    quote: text("quote").notNull(),
    rating: int("rating").notNull().default(5),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    systemId: varchar("system_id", { length: 36 }).references(
      () => systems.id,
      { onDelete: "set null" },
    ),
    featured: boolean("featured").notNull().default(false),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    index("testimonials_featured_idx").on(t.featured),
    index("testimonials_system_idx").on(t.systemId),
  ],
);
