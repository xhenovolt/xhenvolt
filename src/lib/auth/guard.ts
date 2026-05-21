import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE, type SessionRecord } from "./session";

/**
 * Server-side authorization helpers.
 *
 * Single role model today (`admin`). The shape is intentionally future-proof:
 * `requireRole("admin")` will become `requireRole("editor")` etc. once we
 * have RBAC. Every server action calls `requireAdmin()` at minimum.
 */

export async function getCurrentAdmin(): Promise<SessionRecord | null> {
  const c = await cookies();
  return verifySession(c.get(SESSION_COOKIE)?.value);
}

export async function requireAdmin(): Promise<SessionRecord> {
  const s = await getCurrentAdmin();
  if (!s) throw new Error("unauthorized");
  return s;
}

export const ROLES = ["admin", "editor", "viewer"] as const;
export type Role = (typeof ROLES)[number];

const RANK: Record<Role, number> = { admin: 3, editor: 2, viewer: 1 };

export async function requireRole(minimum: Role): Promise<SessionRecord> {
  const s = await requireAdmin();
  const userRank = RANK[(s.role as Role) ?? "viewer"] ?? 0;
  if (userRank < RANK[minimum]) {
    throw new Error("forbidden");
  }
  return s;
}
