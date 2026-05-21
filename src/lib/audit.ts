import { headers } from "next/headers";
import { createHash } from "node:crypto";
import { db, schema } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth/guard";

/**
 * Append-only audit log. Wrap mutation server actions with `audit(...)`
 * to record who did what. Never throws — logging failure must not break
 * the user's action.
 */

export interface AuditEntry {
  action: string;
  entityType: string;
  entityId?: string | null;
  summary?: string | null;
  metadata?: Record<string, unknown> | null;
}

async function hashRequestIp(): Promise<string | null> {
  try {
    const h = await headers();
    const fwd = h.get("x-forwarded-for") ?? "";
    const ip = fwd.split(",")[0].trim();
    if (!ip) return null;
    return createHash("sha256").update(ip).digest("hex").slice(0, 32);
  } catch {
    return null;
  }
}

async function getUserAgent(): Promise<string | null> {
  try {
    const h = await headers();
    return h.get("user-agent");
  } catch {
    return null;
  }
}

export async function audit(entry: AuditEntry): Promise<void> {
  if (!db) return;
  try {
    const [actor, ipHash, userAgent] = await Promise.all([
      getCurrentAdmin(),
      hashRequestIp(),
      getUserAgent(),
    ]);
    await db.insert(schema.adminAuditLogs).values({
      actorId: actor?.userId ?? null,
      actorEmail: actor?.email ?? null,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId ?? null,
      summary: entry.summary ?? null,
      metadata: entry.metadata ?? null,
      ipHash,
      userAgent,
    });
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[audit] insert failed:", err);
    }
  }
}
