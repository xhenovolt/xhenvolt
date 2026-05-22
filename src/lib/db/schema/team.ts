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

export const teamMembers = mysqlTable(
  "team_members",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    role: varchar("role", { length: 200 }).notNull(),
    bio: text("bio"),
    avatarUrl: varchar("avatar_url", { length: 500 }),
    specialties: json("specialties"),
    socials: json("socials"),
    email: varchar("email", { length: 240 }),
    location: varchar("location", { length: 160 }),
    sortOrder: sortOrder(),
    published: published(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("team_slug_uq").on(t.slug),
    index("team_published_idx").on(t.published),
  ],
);
