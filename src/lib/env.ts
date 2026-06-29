/**
 * Environment validation.
 *
 * Cataloged so health checks, startup diagnostics, and clients can ask
 * "is the runtime configured correctly?" without grepping process.env
 * directly.
 *
 * Pattern: every required var lives here. Reading from anywhere else
 * is a smell — it makes operational failures invisible.
 */

export interface EnvVarSpec {
  name: string;
  required: boolean;
  description: string;
  /** Optional regex the value must match (besides being non-empty). */
  pattern?: RegExp;
}

export const ENV_VARS: EnvVarSpec[] = [
  {
    name: "TIDB_HOST",
    required: true,
    description:
      "TiDB Serverless gateway hostname (gateway01.<region>.prod.aws.tidbcloud.com).",
  },
  {
    name: "TIDB_USER",
    required: true,
    description: "TiDB username (looks like <id>.<role>).",
  },
  {
    name: "TIDB_PASSWORD",
    required: true,
    description: "TiDB password issued in the TiDB Cloud console.",
  },
  {
    name: "TIDB_DB",
    required: true,
    description: "TiDB database name (default: test).",
  },
  {
    name: "TIDB_PORT",
    required: false,
    description: "TiDB port. Defaults to 4000.",
    pattern: /^\d+$/,
  },
  {
    name: "DATABASE_MODE",
    required: false,
    description: "tidb (TLS on, default) or mysql (TLS off, local container).",
  },
  {
    name: "REVALIDATE_SECRET",
    required: false,
    description: "Secret for /api/revalidate webhook. Optional in dev.",
  },
  {
    name: "CLOUDINARY_CLOUD_NAME",
    required: false,
    description: "Cloudinary cloud name. Enables Media Library device uploads.",
  },
  {
    name: "CLOUDINARY_API_KEY",
    required: false,
    description: "Cloudinary API key (paired with CLOUDINARY_API_SECRET).",
  },
  {
    name: "CLOUDINARY_API_SECRET",
    required: false,
    description: "Cloudinary API secret. Server-only; never exposed to the client.",
  },
  {
    name: "ANALYTICS_INTERNAL_TOKEN",
    required: false,
    description:
      "Shared secret between middleware and /api/analytics/bot-hit. Defaults to 'internal' if unset; set a random value in production.",
  },
  {
    name: "ANALYTICS_IP_SALT",
    required: false,
    description: "Salt for daily IP hashing in analytics. Falls back to COSMOS_IP_SALT then a default.",
  },
];

export interface EnvIssue {
  name: string;
  description: string;
  reason: "missing" | "empty" | "pattern_mismatch";
}

export interface EnvSnapshot {
  ok: boolean;
  missingRequired: EnvIssue[];
  warnings: EnvIssue[];
  set: string[];
}

export function inspectEnv(): EnvSnapshot {
  const missingRequired: EnvIssue[] = [];
  const warnings: EnvIssue[] = [];
  const set: string[] = [];

  for (const spec of ENV_VARS) {
    const raw = process.env[spec.name];
    if (!raw || raw.trim() === "") {
      const issue: EnvIssue = {
        name: spec.name,
        description: spec.description,
        reason: raw === undefined ? "missing" : "empty",
      };
      if (spec.required) missingRequired.push(issue);
      else warnings.push(issue);
      continue;
    }
    if (spec.pattern && !spec.pattern.test(raw)) {
      const issue: EnvIssue = {
        name: spec.name,
        description: spec.description,
        reason: "pattern_mismatch",
      };
      if (spec.required) missingRequired.push(issue);
      else warnings.push(issue);
      continue;
    }
    set.push(spec.name);
  }

  return {
    ok: missingRequired.length === 0,
    missingRequired,
    warnings,
    set,
  };
}

/**
 * Server-side fail-loud check. Throws — never silently degrades.
 */
export function requireEnv(...names: string[]): void {
  const missing: string[] = [];
  for (const n of names) {
    if (!process.env[n] || process.env[n]?.trim() === "") missing.push(n);
  }
  if (missing.length > 0) {
    const msg = `[env] required vars missing: ${missing.join(", ")}`;
    if (process.env.NODE_ENV !== "production") {
      console.error(msg);
    }
    throw new Error(msg);
  }
}
