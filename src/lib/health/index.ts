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

/**
 * Walks the cause chain of an error and returns a single human-readable
 * string with every layer. Drizzle/neon/pg-style errors often nest the
 * real reason 2-3 levels deep behind "Failed query" wrappers — without
 * this, the dashboard just shows the outermost (useless) message.
 */
/**
 * Drizzle's mysql2 driver returns the raw mysql2 result from `db.execute`,
 * which is the tuple `[rows, fields]`. The Postgres neon-http driver
 * used to return `{rows: [...]}`. This helper handles both shapes so
 * probe code stays driver-agnostic.
 */
function firstRow<T>(r: unknown): T | undefined {
  if (Array.isArray(r)) {
    const inner = r[0];
    if (Array.isArray(inner)) return inner[0] as T;
    if (inner && typeof inner === "object") return inner as T;
    return undefined;
  }
  if (r && typeof r === "object" && "rows" in r) {
    const rows = (r as { rows: unknown[] }).rows;
    return Array.isArray(rows) ? (rows[0] as T) : undefined;
  }
  return undefined;
}

function explainError(err: unknown): string {
  const parts: string[] = [];
  let cur: unknown = err;
  const seen = new Set<unknown>();
  while (cur && !seen.has(cur)) {
    seen.add(cur);
    if (cur instanceof Error) {
      const tag = cur.name && cur.name !== "Error" ? `[${cur.name}] ` : "";
      const msg = cur.message?.trim();
      if (msg) parts.push(`${tag}${msg}`);
      // Drizzle: cause; Node: cause
      const next = (cur as Error & { cause?: unknown }).cause;
      cur = next;
    } else {
      parts.push(String(cur));
      break;
    }
  }
  if (parts.length === 0) return String(err);
  return parts.join("  →  ");
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
      detail: explainError(err),
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
        detail: "TIDB_* credentials are not loaded into the running process.",
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
        (SELECT COUNT(*) FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'admin_users') AS users_exists,
        (SELECT COUNT(*) FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = 'admin_sessions') AS sessions_exists
    `);
    const row = firstRow<{ users_exists: number | string; sessions_exists: number | string }>(r);
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
    const r = await db.execute(sql`SELECT COUNT(*) AS c FROM admin_users`);
    const row = firstRow<{ c: number | string }>(r);
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
        (SELECT COUNT(*) FROM admin_sessions WHERE expires_at > now()) AS live,
        (SELECT COUNT(*) FROM admin_sessions WHERE expires_at <= now()) AS expired
    `);
    const row = firstRow<{ live: number | string; expired: number | string }>(r);
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
        (SELECT COUNT(*) FROM testimonials WHERE published = true AND deleted_at IS NULL) AS testimonials,
        (SELECT COUNT(*) FROM systems WHERE published = true AND deleted_at IS NULL) AS systems,
        (SELECT COUNT(*) FROM faqs WHERE published = true AND deleted_at IS NULL) AS faqs,
        (SELECT COUNT(*) FROM hero_slides WHERE published = true) AS hero,
        (SELECT COUNT(*) FROM statistics WHERE published = true) AS statistics
    `);
    const row = firstRow<Record<string, number | string>>(r);
    if (!row) return { status: "degraded", message: "Could not read content counts" };
    const total = Object.values(row).reduce<number>((a, b) => a + Number(b), 0);
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
        (SELECT COUNT(*) FROM ai_training_documents WHERE published = true AND deleted_at IS NULL) AS docs,
        (SELECT COUNT(*) FROM ai_training_documents WHERE embedding IS NOT NULL) AS with_embedding,
        (SELECT COUNT(*) FROM faqs WHERE published = true AND deleted_at IS NULL) AS faqs
    `);
    const row = firstRow<Record<string, number | string>>(r);
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
