import {
  pgTable,
  varchar,
  text,
  index,
  uniqueIndex,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "./_shared";

export const adminUsers = pgTable(
  "admin_users",
  {
    id: id(),
    email: varchar("email", { length: 240 }).notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    name: varchar("name", { length: 160 }),
    role: varchar("role", { length: 40 }).notNull().default("admin"),
    lastLoginAt: timestamp("last_login_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("admin_users_email_uq").on(t.email)],
);

export const adminSessions = pgTable(
  "admin_sessions",
  {
    id: id(),
    token: varchar("token", { length: 64 }).notNull().unique(),
    userId: uuid("user_id")
      .references(() => adminUsers.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    ipHash: varchar("ip_hash", { length: 64 }),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (t) => [
    uniqueIndex("admin_sessions_token_uq").on(t.token),
    index("admin_sessions_user_idx").on(t.userId),
    index("admin_sessions_expires_idx").on(t.expiresAt),
  ],
);
