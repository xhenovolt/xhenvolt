# Database Health

## How we know whether Neon is up

Three layers, each independently useful.

### 1. `hasDb()` — synchronous, in-process

[`src/lib/db/index.ts`](../src/lib/db/index.ts) exposes
`hasDb()` which returns `true` iff the Drizzle client was initialized.
The client is initialized iff `process.env.DATABASE_URL` was set at
module-load time.

This is the only check used in hot paths (every server action calls
`hasDb()` before touching the DB). Cost: zero — it's a closure read.

### 2. `safeQuery()` — per-call timeout + fallback

Every public-site read goes through `safeQuery` in
[`src/lib/cache/safe.ts`](../src/lib/cache/safe.ts):

- 4-second timeout
- Returns a typed fallback on error or timeout
- Production reads cached via `unstable_cache` keyed on per-domain tags
- Never throws

So even when Neon is down, the public site renders (with hardcoded
fallbacks in components). The admin uses raw Drizzle (no `safeQuery`)
because it should fail loudly when the DB is down.

### 3. `/api/admin/health` — full probe report

[`src/lib/health/index.ts`](../src/lib/health/index.ts) runs seven
independent probes in parallel, each with its own 4-second timeout:

| Probe | What it checks |
|---|---|
| Environment variables | All required vars present and valid by pattern |
| Database connectivity | `SELECT 1` succeeds |
| Auth tables | `admin_users` + `admin_sessions` tables exist |
| Admin users | At least one row in `admin_users` |
| Active sessions | Count live + expired sessions |
| CMS content tables | Counts published rows across testimonials/systems/faqs/hero/stats |
| AI knowledge corpus | Count of AI docs + FAQs + how many have embeddings |

Each probe returns `{ status: 'ok' | 'degraded' | 'down' | 'unknown', message, detail, durationMs }`.
The endpoint aggregates to the worst status.

HTTP status codes match the verdict:
- `200` — all OK
- `207 Multi-Status` — at least one degraded probe
- `503 Service Unavailable` — at least one down probe
- `500` — couldn't even run the probes (extremely degraded)

## Where the health report surfaces

1. **`/admin/system-health`** — visual dashboard grouped by category.
   Includes "How to use" footer with the four most likely fixes.
2. **Top bar HealthPill** — small live indicator visible on every admin
   page, polling every 60s. Click → opens `/admin/system-health`.
3. **`/admin/login`** — fetches the report on mount. If status is
   `down`, the sign-in button is disabled with a clear red banner. If
   `degraded`, the form still works but shows an amber banner.
4. **External monitoring** — the endpoint returns standard JSON, so
   Pingdom / UptimeRobot / Vercel monitors can hit it directly.

## Detecting silent failures

A common failure mode before Phase 8: `DATABASE_URL` not loaded into
the running process → all queries silently return fallback values →
admin login returns "Invalid email or password" (a lie) → the operator
spends an hour confused.

The current safeguards:

1. **`/admin/system-health`** would have shown "Environment variables —
   DOWN" with the missing variable name.
2. **`/admin/login`** banner would have said "System is down — sign-in
   will not succeed" before the user typed anything.
3. **The login API itself** runs `hasDb()` BEFORE calling
   `authenticateAdmin`, so it returns `database_unavailable` (orange UI
   card) instead of `invalid_credentials` (red UI card).

The system now never lies about infra failure.

## Connection management

The Drizzle client uses `drizzle-orm/neon-http`. It's a fetch-based
driver — no socket pool to manage, no stale connections, no
reconnection logic needed. Each query is an HTTPS POST to Neon's SQL
endpoint over port 443.

The client is stored on `globalThis.__xhenvoltDb` to survive Next.js
HMR. In production, every request goes through the same `db` instance.

## Recovery procedures

| Probe DOWN | Fix |
|---|---|
| Environment variables | Set `DATABASE_URL` in `.env.local`, restart dev server (or set in Vercel dashboard, redeploy) |
| Database connectivity | Verify Neon project is awake (free tier scales to zero), check the URL, check `sslmode=require` is in the query string |
| Auth tables | `npm run db:migrate` |
| Admin users | `npm run db:create-admin -- email password` |
| CMS content tables | `npm run db:seed` (idempotent — wipes seeded tables and reinserts) |
| AI knowledge corpus | Add docs/FAQs from `/admin/ai-docs` or `/admin/faqs`, or re-run `npm run db:seed` |
