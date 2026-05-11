import {
  pgTable,
  varchar,
  text,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  published,
  sortOrder,
} from "./_shared";

export const teamMembers = pgTable(
  "team_members",
  {
    id: id(),
    slug: varchar("slug", { length: 160 }).notNull().unique(),
    name: varchar("name", { length: 200 }).notNull(),
    role: varchar("role", { length: 200 }).notNull(),
    bio: text("bio"),
    avatarUrl: text("avatar_url"),
    specialties: jsonb("specialties"),
    socials: jsonb("socials"),
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
