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
    name: "DATABASE_URL",
    required: true,
    description: "Postgres connection string (Neon). Used by Drizzle for all reads + writes.",
    pattern: /^postgres(ql)?:\/\//i,
  },
  {
    name: "REVALIDATE_SECRET",
    required: false,
    description: "Secret for /api/revalidate webhook. Optional in dev.",
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
  set: string[]; // names of vars that are present (values not exposed)
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
 * Server-side fail-loud check. Call at module-load from anywhere that
 * absolutely cannot run without these vars (db client, auth helpers).
 * Throws — never silently degrades.
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
