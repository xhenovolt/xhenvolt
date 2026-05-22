import {
  mysqlTable,
  varchar,
  text,
  index,
  uniqueIndex,
  timestamp,
} from "drizzle-orm/mysql-core";
import { id, createdAt, updatedAt } from "./_shared";

export const adminUsers = mysqlTable(
  "admin_users",
  {
    id: id(),
    email: varchar("email", { length: 240 }).notNull().unique(),
    passwordHash: varchar("password_hash", { length: 500 }).notNull(),
    name: varchar("name", { length: 160 }),
    role: varchar("role", { length: 40 }).notNull().default("admin"),
    lastLoginAt: timestamp("last_login_at", { fsp: 3 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [uniqueIndex("admin_users_email_uq").on(t.email)],
);

export const adminSessions = mysqlTable(
  "admin_sessions",
  {
    id: id(),
    token: varchar("token", { length: 64 }).notNull().unique(),
    userId: varchar("user_id", { length: 36 })
      .references(() => adminUsers.id, { onDelete: "cascade" })
      .notNull(),
    expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
    lastActiveAt: timestamp("last_active_at", { fsp: 3 })
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
