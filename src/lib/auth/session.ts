/**
 * Real server-side sessions backed by the `admin_sessions` table on TiDB.
 *
 * - The cookie contains an opaque 32-byte random token, base64url-encoded.
 * - The token is the lookup key for a row in `admin_sessions`.
 * - Validation is a DB read + expiry check. There is no signing, no JWT, no
 *   stateless verification anywhere.
 * - Logout deletes the row.
 *
 * Node-only: uses Drizzle's mysql2 driver under the hood. Middleware that
 * needs to verify sessions must run on the Node runtime, not Edge.
 */

import { and, eq, gt, sql } from "drizzle-orm";
import { db, schema } from "@/lib/db";
import { SESSION_COOKIE, SESSION_TTL_SECONDS } from "./cookie";

export { SESSION_COOKIE, SESSION_TTL_SECONDS };

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export interface SessionRecord {
  userId: string;
  email: string;
  name: string | null;
  role: string;
  expiresAt: Date;
}

export async function createSession(input: {
  userId: string;
  ipHash?: string;
  userAgent?: string;
  ttlSeconds?: number;
}): Promise<{ token: string; maxAge: number }> {
  if (!db) throw new Error("db_unavailable");
  const ttl = input.ttlSeconds ?? SESSION_TTL_SECONDS;
  const token = generateToken();
  const expiresAt = new Date(Date.now() + ttl * 1000);
  await db.insert(schema.adminSessions).values({
    token,
    userId: input.userId,
    expiresAt,
    ipHash: input.ipHash ?? null,
    userAgent: input.userAgent ?? null,
  });
  return { token, maxAge: ttl };
}

export async function verifySession(
  token: string | undefined | null,
): Promise<SessionRecord | null> {
  if (!token || !db) return null;
  try {
    const rows = await db
      .select({
        userId: schema.adminSessions.userId,
        expiresAt: schema.adminSessions.expiresAt,
        email: schema.adminUsers.email,
        name: schema.adminUsers.name,
        role: schema.adminUsers.role,
      })
      .from(schema.adminSessions)
      .innerJoin(
        schema.adminUsers,
        eq(schema.adminSessions.userId, schema.adminUsers.id),
      )
      .where(
        and(
          eq(schema.adminSessions.token, token),
          gt(schema.adminSessions.expiresAt, new Date()),
        ),
      )
      .limit(1);
    const row = rows[0];
    if (!row) return null;

    // Sliding-window touch (best effort; don't block on failure).
    db
      .update(schema.adminSessions)
      .set({ lastActiveAt: sql`now()` })
      .where(eq(schema.adminSessions.token, token))
      .catch(() => {});

    return {
      userId: row.userId,
      email: row.email,
      name: row.name,
      role: row.role,
      expiresAt: row.expiresAt,
    };
  } catch {
    return null;
  }
}

export async function destroySession(token: string | undefined | null): Promise<void> {
  if (!token || !db) return;
  try {
    await db.delete(schema.adminSessions).where(eq(schema.adminSessions.token, token));
  } catch {
    // best effort
  }
}

export async function purgeExpiredSessions(): Promise<number> {
  if (!db) return 0;
  const res = await db
    .delete(schema.adminSessions)
    .where(sql`expires_at < NOW()`);
  // mysql2 returns ResultSetHeader with affectedRows.
  const header = res as unknown as { affectedRows?: number } | Array<unknown>;
  if (Array.isArray(header)) return header.length;
  return header.affectedRows ?? 0;
}
