import { createHash } from "node:crypto";
import { db, schema } from "@/lib/db";

/**
 * Download-intent analytics.
 *
 * We log a row when a user CLICKS download (the resolver redirect), not when
 * a byte transfers — GitHub serves the bytes. Personal data is minimized:
 * the raw IP is never stored, only a daily-salted SHA-256 hash so the same
 * visitor can be roughly de-duplicated within a day without being tracked
 * across days or being reversible to an address.
 */

export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const salt = process.env.COSMOS_IP_SALT ?? "xhenvolt-cosmos";
  return createHash("sha256").update(`${ip}|${day}|${salt}`).digest("hex");
}

/** Pull a best-effort client IP from common proxy headers. */
export function clientIpFromHeaders(headers: Headers): string | null {
  const fwd = headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return headers.get("x-real-ip") ?? null;
}

export interface DownloadEventInput {
  appProductId: string | null;
  releaseId: string | null;
  slug: string;
  platform: string | null;
  version: string | null;
  userAgent: string | null;
  ip: string | null;
  referrer: string | null;
}

/**
 * Fire-and-forget insert. Never throws — analytics must never block or break
 * a download redirect.
 */
export async function logDownloadEvent(input: DownloadEventInput): Promise<void> {
  if (!db) return;
  try {
    await db.insert(schema.downloadEvents).values({
      appProductId: input.appProductId,
      releaseId: input.releaseId,
      slug: input.slug,
      platform: input.platform,
      version: input.version,
      userAgent: input.userAgent?.slice(0, 500) ?? null,
      ipHash: hashIp(input.ip),
      referrer: input.referrer?.slice(0, 500) ?? null,
    });
  } catch {
    // best effort — swallow.
  }
}
