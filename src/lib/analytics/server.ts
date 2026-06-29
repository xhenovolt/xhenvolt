import { createHash } from "node:crypto";

/**
 * Server-side analytics helpers: IP hashing, geo extraction, sanitizers.
 * Shared by the tracking APIs and the server-side bot logger.
 */

export function clientIpFromHeaders(h: Headers): string | null {
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return h.get("x-real-ip") ?? null;
}

/** Daily-salted SHA-256 — never store or log the raw IP. */
export function hashIp(ip: string | null | undefined): string | null {
  if (!ip) return null;
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.ANALYTICS_IP_SALT ?? process.env.COSMOS_IP_SALT ?? "xhenvolt-analytics";
  return createHash("sha256").update(`${ip}|${day}|${salt}`).digest("hex");
}

/** Vercel injects geo headers in production; absent locally → nulls. */
export function geoFromHeaders(h: Headers): { country: string | null; city: string | null } {
  const country = h.get("x-vercel-ip-country");
  const cityRaw = h.get("x-vercel-ip-city");
  const city = cityRaw ? decodeURIComponent(cityRaw) : null;
  return { country: country || null, city: city || null };
}

/** Clamp a string to a max length (or null). Trims; empty -> null. */
export function clamp(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const t = value.trim();
  if (!t) return null;
  return t.slice(0, max);
}

/** Only accept same-origin-style relative paths to avoid junk/injection. */
export function cleanPath(value: unknown): string | null {
  const p = clamp(value, 300);
  if (!p) return null;
  // Accept "/..." paths; if a full URL slipped in, keep just the pathname.
  if (p.startsWith("/")) return p;
  try {
    return new URL(p).pathname;
  } catch {
    return null;
  }
}
