/**
 * System health checks.
 *
 * Each probe is independent, has a name + category, returns a verdict.
 * The dashboard composes them. A probe MUST NOT throw — it captures
 * the failure as part of its returned state.
 *
 * Probes have a 4-second timeout each; the dashboard renders even if
 * Neon is dead.
 */

import { sql } from "drizzle-orm";
import { db, hasDb } from "@/lib/db";
import { inspectEnv } from "@/lib/env";

export type ProbeStatus = "ok" | "degraded" | "down" | "unknown";

export interface ProbeResult {
  name: string;
  category: "infrastructure" | "configuration" | "auth" | "cms" | "ai";
  status: ProbeStatus;
  message: string;
  detail?: string;
  durationMs: number;
  checkedAt: string;
}

export interface HealthReport {
  status: ProbeStatus;
  generatedAt: string;
  probes: ProbeResult[];
}

const TIMEOUT_MS = 4000;

async function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`${label}: timeout after ${ms}ms`)), ms);
    p.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (err) => {
        clearTimeout(t);
        reject(err);
      },
    );
  });
}

async function timed(name: string, category: ProbeResult["category"], fn: () => Promise<Omit<ProbeResult, "name" | "category" | "durationMs" | "checkedAt">>): Promise<ProbeResult> {
  const start = Date.now();
  try {
    const r = await withTimeout(fn(), TIMEOUT_MS, name);
    return { ...r, name, category, durationMs: Date.now() - start, checkedAt: new Date().toISOString() };
  } catch (err) {
    return {
      name,
      category,
      status: "down",
      message: "Probe threw or timed out",
      detail: err instanceof Error ? err.message : String(err),
      durationMs: Date.now() - start,
      checkedAt: new Date().toISOString(),
    };
  }
}

async function probeEnv(): Promise<ProbeResult> {
  return timed("Environment variables", "configuration", async () => {
    const snap = inspectEnv();
    if (!snap.ok) {
      return {
        status: "down",
        message: `${snap.missingRequired.length} required variable(s) missing or invalid`,
        detail: snap.missingRequired
          .map((i) => `${i.name} (${i.reason})`)
          .join(", "),
      };
    }
    if (snap.warnings.length > 0) {
      return {
        status: "degraded",
        message: `${snap.set.length} set, ${snap.warnings.length} optional var(s) missing`,
        detail: snap.warnings.map((w) => `${w.name} (${w.reason})`).join(", "),
      };
    }
    return {
      status: "ok",
      message: `${snap.set.length} required variable(s) set`,
    };
  });
}

async function probeDatabase(): Promise<ProbeResult> {
  return timed("Database connectivity", "infrastructure", async () => {
    if (!hasDb() || !db) {
      return {
        status: "down",
        message: "DB client not initialized",
        detail: "DATABASE_URL is not loaded into the running process.",
      };
    }
    const r = await db.execute(sql`SELECT 1 AS ok`);
    const rows = (r as unknown as { rows?: unknown[] }).rows ?? (r as unknown as unknown[]);
    const count = Array.isArray(rows) ? rows.length : 0;
    if (count === 0) {
      return {
        status: "degraded",
        message: "DB responded but returned no rows for SELECT 1",
      };
    }
    return {
      status: "ok",
      message: "Connected; SELECT 1 returned 1 row",
    };
  });
}

async function probeAuthTables(): Promise<ProbeResult> {
  return timed("Auth tables", "auth", async () => {
    if (!hasDb() || !db) {
      return {
        status: "unknown",
        message: "Skipped — DB unavailable",
      };
    }
    const r = await db.execute(sql`
      SELECT
        (SELECT count(*) FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'admin_users') AS users_exists,
        (SELECT count(*) FROM information_schema.tables
         WHERE table_schema = 'public' AND table_name = 'admin_sessions') AS sessions_exists
    `);
    const rows = ((r as unknown as { rows?: Array<{ users_exists: string; sessions_exists: string }> }).rows
      ?? (r as unknown as Array<{ users_exists: string; sessions_exists: string }>));
    const row = Array.isArray(rows) ? rows[0] : undefined;
    const users = Number(row?.users_exists ?? 0);
    const sessions = Number(row?.sessions_exists ?? 0);
    if (users < 1 || sessions < 1) {
      return {
        status: "down",
        message: "Required auth tables missing",
        detail: `admin_users: ${users}, admin_sessions: ${sessions}. Run: npm run db:migrate`,
      };
    }
    return { status: "ok", message: "admin_users + admin_sessions present" };
  });
}

async function probeAdminUserCount(): Promise<ProbeResult> {
  return timed("Admin users", "auth", async () => {
    if (!hasDb() || !db) {
      return { status: "unknown", message: "Skipped — DB unavailable" };
    }
    const r = await db.execute(sql`SELECT count(*)::int AS c FROM admin_users`);
    const rows = ((r as unknown as { rows?: Array<{ c: number }> }).rows
      ?? (r as unknown as Array<{ c: number }>));
    const row = Array.isArray(rows) ? rows[0] : undefined;
    const c = Number(row?.c ?? 0);
    if (c === 0) {
      return {
        status: "down",
        message: "No admin users registered",
        detail: "Bootstrap one with: npm run db:create-admin -- <email> <password>",
      };
    }
    return { status: "ok", message: `${c} admin user(s) registered` };
  });
}

async function probeActiveSessions(): Promise<ProbeResult> {
  return timed("Active sessions", "auth", async () => {
    if (!hasDb() || !db) {
      return { status: "unknown", message: "Skipped — DB unavailable" };
    }
    const r = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM admin_sessions WHERE expires_at > now()) AS live,
        (SELECT count(*)::int FROM admin_sessions WHERE expires_at <= now()) AS expired
    `);
    const rows = ((r as unknown as { rows?: Array<{ live: number; expired: number }> }).rows
      ?? (r as unknown as Array<{ live: number; expired: number }>));
    const row = Array.isArray(rows) ? rows[0] : undefined;
    const live = Number(row?.live ?? 0);
    const expired = Number(row?.expired ?? 0);
    return {
      status: "ok",
      message: `${live} active session(s)`,
      detail: expired > 0 ? `${expired} expired row(s) — safe to leave; expiry is enforced on lookup` : undefined,
    };
  });
}

async function probeCmsContent(): Promise<ProbeResult> {
  return timed("CMS content tables", "cms", async () => {
    if (!hasDb() || !db) {
      return { status: "unknown", message: "Skipped — DB unavailable" };
    }
    const r = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM testimonials WHERE published = true AND deleted_at IS NULL) AS testimonials,
        (SELECT count(*)::int FROM systems WHERE published = true AND deleted_at IS NULL) AS systems,
        (SELECT count(*)::int FROM faqs WHERE published = true AND deleted_at IS NULL) AS faqs,
        (SELECT count(*)::int FROM hero_slides WHERE published = true) AS hero,
        (SELECT count(*)::int FROM statistics WHERE published = true) AS statistics
    `);
    const rows = ((r as unknown as { rows?: Array<Record<string, number>> }).rows
      ?? (r as unknown as Array<Record<string, number>>));
    const row = Array.isArray(rows) ? rows[0] : undefined;
    if (!row) return { status: "degraded", message: "Could not read content counts" };
    const total = Object.values(row).reduce((a, b) => a + Number(b), 0);
    return {
      status: total > 0 ? "ok" : "degraded",
      message: `${total} published items across core tables`,
      detail: Object.entries(row).map(([k, v]) => `${k}: ${v}`).join(" · "),
    };
  });
}

async function probeAiCorpus(): Promise<ProbeResult> {
  return timed("AI knowledge corpus", "ai", async () => {
    if (!hasDb() || !db) {
      return { status: "unknown", message: "Skipped — DB unavailable" };
    }
    const r = await db.execute(sql`
      SELECT
        (SELECT count(*)::int FROM ai_training_documents WHERE published = true AND deleted_at IS NULL) AS docs,
        (SELECT count(*)::int FROM ai_training_documents WHERE embedding IS NOT NULL) AS with_embedding,
        (SELECT count(*)::int FROM faqs WHERE published = true AND deleted_at IS NULL) AS faqs
    `);
    const rows = ((r as unknown as { rows?: Array<Record<string, number>> }).rows
      ?? (r as unknown as Array<Record<string, number>>));
    const row = Array.isArray(rows) ? rows[0] : undefined;
    const docs = Number(row?.docs ?? 0);
    const withEmb = Number(row?.with_embedding ?? 0);
    const faqs = Number(row?.faqs ?? 0);
    if (docs === 0 && faqs === 0) {
      return {
        status: "degraded",
        message: "No knowledge — Xhenvolt AI will only return the fallback message",
        detail: "Add FAQs or training docs from /admin",
      };
    }
    return {
      status: "ok",
      message: `${docs} doc(s), ${faqs} FAQ(s)`,
      detail: withEmb > 0
        ? `${withEmb}/${docs} doc(s) have embeddings`
        : "No embeddings yet — keyword scoring is in use",
    };
  });
}

function worstStatus(results: ProbeResult[]): ProbeStatus {
  if (results.some((r) => r.status === "down")) return "down";
  if (results.some((r) => r.status === "degraded")) return "degraded";
  if (results.some((r) => r.status === "unknown")) return "degraded";
  return "ok";
}

export async function runHealthChecks(): Promise<HealthReport> {
  const probes = await Promise.all([
    probeEnv(),
    probeDatabase(),
    probeAuthTables(),
    probeAdminUserCount(),
    probeActiveSessions(),
    probeCmsContent(),
    probeAiCorpus(),
  ]);
  return {
    status: worstStatus(probes),
    generatedAt: new Date().toISOString(),
    probes,
  };
}
