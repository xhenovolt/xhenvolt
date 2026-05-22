/**
 * Low-level database connectivity probe for TiDB / MySQL.
 *
 * Bypasses Drizzle entirely and opens a raw mysql2 connection so the
 * caller sees the real failure (DNS, TLS, auth, host unreachable) — not
 * a wrapped "Failed query" message from the ORM.
 *
 * Used by /api/admin/health/db. The shape of the result is intentionally
 * stable so the system-health UI can render named diagnostics for each
 * cause without inspecting the raw error.
 */

import mysql from "mysql2/promise";
import { readTidbConfig, toPoolOptions } from "@/lib/db/config";

export interface DbProbeResult {
  ok: boolean;
  cause:
    | "ok"
    | "missing_credentials"
    | "dns_failed"
    | "network_unreachable"
    | "tls_failed"
    | "auth_failed"
    | "unknown_database"
    | "host_refused"
    | "timeout"
    | "unknown";
  message: string;
  detail?: string;
  hint?: string;
  /** mysql2 error code, if available (ER_ACCESS_DENIED_ERROR, ECONNREFUSED, ...) */
  errorCode?: string;
  durationMs: number;
  serverVersion?: string;
  parsedConfig?: {
    host: string;
    port: number;
    database: string;
    user: string;
    ssl: boolean;
  };
}

const TIMEOUT_MS = 8000;

function classify(err: unknown): {
  cause: DbProbeResult["cause"];
  hint: string;
  code?: string;
} {
  const e = err as { code?: string; errno?: number; message?: string } & Error;
  const code = e?.code ?? "";
  const message = (e?.message ?? "").toLowerCase();

  if (code === "ER_ACCESS_DENIED_ERROR" || /access denied/i.test(message)) {
    return {
      cause: "auth_failed",
      code,
      hint:
        "Username or password rejected. Verify TIDB_USER and TIDB_PASSWORD in .env.local match the TiDB Cloud console.",
    };
  }
  if (code === "ER_BAD_DB_ERROR" || /unknown database/i.test(message)) {
    return {
      cause: "unknown_database",
      code,
      hint:
        "The database name doesn't exist on this cluster. Check TIDB_DB and create the database in the TiDB console if needed.",
    };
  }
  if (code === "ENOTFOUND" || /getaddrinfo|enotfound/i.test(message)) {
    return {
      cause: "dns_failed",
      code,
      hint:
        "TIDB_HOST did not resolve. The TiDB Serverless host looks like gateway01.<region>.prod.aws.tidbcloud.com.",
    };
  }
  if (code === "ECONNREFUSED" || /refused/i.test(message)) {
    return {
      cause: "host_refused",
      code,
      hint:
        "Host actively refused the connection. Confirm TIDB_PORT (4000 for Serverless) and that nothing local is shadowing the host.",
    };
  }
  if (
    code === "ENETUNREACH" ||
    code === "EHOSTUNREACH" ||
    /unreachable|network/i.test(message)
  ) {
    return {
      cause: "network_unreachable",
      code,
      hint:
        "Cannot route to the TiDB host. Check egress firewall, VPN, or IPv6-only network issues.",
    };
  }
  if (
    code === "ETIMEDOUT" ||
    code === "PROTOCOL_CONNECTION_TIMEOUT" ||
    /timeout|timed out/i.test(message)
  ) {
    return {
      cause: "timeout",
      code,
      hint:
        "Connection didn't complete in time. TiDB Serverless may be cold-starting — retry once, or check network egress.",
    };
  }
  if (/tls|ssl|certificate|handshake/i.test(message)) {
    return {
      cause: "tls_failed",
      code,
      hint:
        "TLS handshake failed. TiDB Serverless requires TLS — keep DATABASE_MODE=tidb and ensure Node has up-to-date CA certs.",
    };
  }
  return {
    cause: "unknown",
    code,
    hint: "Connection failed for an unclassified reason. See raw error.",
  };
}

export async function probeDatabaseDeep(): Promise<DbProbeResult> {
  const start = Date.now();
  const cfg = readTidbConfig();

  if (!cfg.ok) {
    return {
      ok: false,
      cause: "missing_credentials",
      message: `TiDB credentials missing: ${"missing" in cfg ? cfg.missing.join(", ") : "unknown"}`,
      hint:
        "Set TIDB_HOST, TIDB_USER, TIDB_PASSWORD, TIDB_DB in .env.local, then restart the dev server. Next.js only reads env files at startup.",
      durationMs: Date.now() - start,
    };
  }

  const parsedConfig = {
    host: cfg.config.host,
    port: cfg.config.port,
    database: cfg.config.database,
    user: cfg.config.user,
    ssl: cfg.config.ssl,
  };

  let conn: mysql.Connection | undefined;
  try {
    const opts = toPoolOptions(cfg.config);
    conn = await Promise.race([
      mysql.createConnection({
        host: opts.host,
        port: opts.port,
        user: opts.user,
        password: opts.password,
        database: opts.database,
        ssl: opts.ssl as mysql.ConnectionOptions["ssl"],
        connectTimeout: TIMEOUT_MS,
      }),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`probe timeout after ${TIMEOUT_MS}ms`)),
          TIMEOUT_MS,
        ),
      ),
    ]);

    const [rows] = (await conn.query("SELECT VERSION() AS v, 1 AS ok")) as [
      Array<{ v: string; ok: number }>,
      unknown,
    ];
    const durationMs = Date.now() - start;
    return {
      ok: true,
      cause: "ok",
      message: "Connected; SELECT VERSION() returned successfully.",
      serverVersion: rows[0]?.v,
      durationMs,
      parsedConfig,
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    const cls = classify(err);
    return {
      ok: false,
      cause: cls.cause,
      message: err instanceof Error ? err.message : String(err),
      detail: err instanceof Error ? err.stack?.split("\n").slice(0, 4).join("\n") : undefined,
      hint: cls.hint,
      errorCode: cls.code,
      durationMs,
      parsedConfig,
    };
  } finally {
    try {
      await conn?.end();
    } catch {
      // ignore — already failing
    }
  }
}
