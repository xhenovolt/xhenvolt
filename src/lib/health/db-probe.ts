/**
 * Low-level database connectivity probe.
 *
 * Bypasses Drizzle entirely and hits Neon's HTTP SQL endpoint with a
 * single hand-built request, so the response carries the raw HTTP
 * status and Neon's error body. Surfaces the actual reason the runtime
 * can't reach the DB.
 *
 * Used by /api/admin/health/db. Drizzle's normal probe is good for the
 * happy path; this one is for "the happy probe failed, what's actually
 * wrong?".
 */

export interface DbProbeResult {
  ok: boolean;
  /** Stable category for the UI to render diagnostics. */
  cause:
    | "ok"
    | "no_database_url"
    | "url_parse_failed"
    | "dns_failed"
    | "network_unreachable"
    | "tls_failed"
    | "http_4xx"
    | "http_5xx"
    | "neon_endpoint_disabled"
    | "neon_endpoint_paused"
    | "auth_failed"
    | "channel_binding_unsupported"
    | "timeout"
    | "unknown";
  message: string;
  detail?: string;
  hint?: string;
  /** HTTP status from Neon's SQL endpoint, if a response was received. */
  httpStatus?: number;
  /** Truncated response body, if any. */
  body?: string;
  /** Time the probe took, in milliseconds. */
  durationMs: number;
  /** Connection-string parameters detected (no credentials echoed). */
  parsedUrl?: {
    host: string;
    database: string;
    sslmode: string | null;
    channelBinding: string | null;
  };
}

const TIMEOUT_MS = 8000;

function parseUrl(raw: string) {
  try {
    const u = new URL(raw);
    return {
      ok: true as const,
      host: u.hostname,
      database: u.pathname.replace(/^\//, "") || "(root)",
      sslmode: u.searchParams.get("sslmode"),
      channelBinding: u.searchParams.get("channel_binding"),
    };
  } catch (err) {
    return { ok: false as const, message: err instanceof Error ? err.message : String(err) };
  }
}

function classifyHttp(status: number, body: string): {
  cause: DbProbeResult["cause"];
  hint: string;
} {
  if (status === 401 || status === 403) {
    if (/channel.?binding/i.test(body)) {
      return {
        cause: "channel_binding_unsupported",
        hint: "Remove '&channel_binding=require' from DATABASE_URL — the HTTP driver doesn't support SCRAM channel binding.",
      };
    }
    return {
      cause: "auth_failed",
      hint: "Username/password rejected. The Neon password may have been rotated. Verify DATABASE_URL.",
    };
  }
  if (status === 404) {
    return {
      cause: "neon_endpoint_disabled",
      hint: "Neon endpoint not found. The compute may be deleted or the URL is wrong.",
    };
  }
  if (status === 503 || /paused/i.test(body) || /suspended/i.test(body)) {
    return {
      cause: "neon_endpoint_paused",
      hint: "The Neon project is paused or scaled to zero. Trigger a wake by visiting the Neon dashboard, then retry.",
    };
  }
  if (status >= 500) {
    return { cause: "http_5xx", hint: "Neon returned a server error. Retry in a moment." };
  }
  return { cause: "http_4xx", hint: "Neon rejected the request — see the body." };
}

function classifyFetchError(err: unknown, durationMs: number): {
  cause: DbProbeResult["cause"];
  hint: string;
} {
  const msg = err instanceof Error ? err.message : String(err);
  const cause = err instanceof Error ? (err as Error & { cause?: unknown }).cause : undefined;
  const causeStr = cause instanceof Error ? cause.message : String(cause ?? "");
  const combined = `${msg}  ${causeStr}`.toLowerCase();

  if (durationMs >= TIMEOUT_MS - 500 || /timeout|timed out/i.test(combined)) {
    return {
      cause: "timeout",
      hint:
        "The request didn't complete in time. Possible causes: Neon project is paused, IPv6 routing is broken on your machine, or the network is firewalled. Try setting NODE_OPTIONS=--dns-result-order=ipv4first when starting the dev server.",
    };
  }
  if (/enotfound|getaddrinfo|dns/i.test(combined)) {
    return {
      cause: "dns_failed",
      hint: "Hostname did not resolve. Check the URL — it should look like ep-xxx.region.aws.neon.tech.",
    };
  }
  if (/enetunreach|network is unreachable|econnrefused/i.test(combined)) {
    return {
      cause: "network_unreachable",
      hint:
        "Cannot route to the host. If it resolves to IPv6 only, your network may not support IPv6. Try NODE_OPTIONS=--dns-result-order=ipv4first.",
    };
  }
  if (/certificate|tls|ssl/i.test(combined)) {
    return { cause: "tls_failed", hint: "TLS handshake failed. Confirm sslmode=require in the URL." };
  }
  return { cause: "unknown", hint: "Fetch failed for an unknown reason." };
}

export async function probeDatabaseDeep(): Promise<DbProbeResult> {
  const start = Date.now();
  const url = process.env.DATABASE_URL;

  if (!url) {
    return {
      ok: false,
      cause: "no_database_url",
      message: "DATABASE_URL is not set in the running process.",
      hint:
        "Add DATABASE_URL=\"...\" to .env.local at the repo root, then restart the dev server. Next.js only reads env files at startup.",
      durationMs: Date.now() - start,
    };
  }

  const parsed = parseUrl(url);
  if (!parsed.ok) {
    return {
      ok: false,
      cause: "url_parse_failed",
      message: "DATABASE_URL is malformed.",
      detail: parsed.message,
      hint: "Expected format: postgresql://user:password@host/db?sslmode=require",
      durationMs: Date.now() - start,
    };
  }

  const endpoint = `https://${parsed.host}/sql`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Neon-Connection-String": url,
    "Neon-Raw-Text-Output": "false",
    "Neon-Array-Mode": "false",
  };

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), TIMEOUT_MS);
    let res: Response;
    try {
      res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ query: "SELECT 1 AS ok", params: [] }),
        signal: ac.signal,
      });
    } finally {
      clearTimeout(t);
    }
    const durationMs = Date.now() - start;
    const body = (await res.text()).slice(0, 600);

    if (res.ok) {
      return {
        ok: true,
        cause: "ok",
        message: "Reached Neon HTTP endpoint and SELECT 1 returned successfully.",
        httpStatus: res.status,
        durationMs,
        parsedUrl: {
          host: parsed.host,
          database: parsed.database,
          sslmode: parsed.sslmode,
          channelBinding: parsed.channelBinding,
        },
      };
    }

    const cls = classifyHttp(res.status, body);
    return {
      ok: false,
      cause: cls.cause,
      message: `Neon returned HTTP ${res.status}.`,
      detail: body,
      hint: cls.hint,
      httpStatus: res.status,
      body,
      durationMs,
      parsedUrl: {
        host: parsed.host,
        database: parsed.database,
        sslmode: parsed.sslmode,
        channelBinding: parsed.channelBinding,
      },
    };
  } catch (err) {
    const durationMs = Date.now() - start;
    const cls = classifyFetchError(err, durationMs);
    const innerCause = err instanceof Error ? (err as Error & { cause?: unknown }).cause : undefined;
    return {
      ok: false,
      cause: cls.cause,
      message: err instanceof Error ? err.message : String(err),
      detail: innerCause instanceof Error ? innerCause.message : innerCause ? String(innerCause) : undefined,
      hint: cls.hint,
      durationMs,
      parsedUrl: {
        host: parsed.host,
        database: parsed.database,
        sslmode: parsed.sslmode,
        channelBinding: parsed.channelBinding,
      },
    };
  }
}
