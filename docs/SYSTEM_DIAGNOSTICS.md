# System Diagnostics

How to know what's broken, fast.

## Three live surfaces

### 1. Top-bar HealthPill — always visible

Every admin page renders a small pill in the top bar showing the
current overall status (`OK` / `DEGRADED` / `DOWN`). It polls
`/api/admin/health` every 60 seconds. Click it to open the full
dashboard.

Source:
[`src/app/admin/_components/HealthPill.tsx`](../src/app/admin/_components/HealthPill.tsx)

### 2. `/admin/system-health` — full dashboard

Lists every probe with status, message, detail, runtime, and last-checked
timestamp. Probes are grouped by category (Infrastructure, Configuration,
Authentication, CMS, AI).

The dashboard renders even when probes are timing out — each probe is
independent and self-contained, so one failing probe doesn't break the
view.

Source:
[`src/app/admin/system-health/page.tsx`](../src/app/admin/system-health/page.tsx)

### 3. `/api/admin/health` — JSON

The dashboard, the pill, and external monitors all hit this endpoint.

```bash
curl http://localhost:3000/api/admin/health | jq
```

Returns:
```json
{
  "status": "ok",
  "generatedAt": "2026-05-11T18:50:19.486Z",
  "probes": [
    { "name": "Database connectivity", "category": "infrastructure",
      "status": "ok", "message": "Connected; SELECT 1 returned 1 row",
      "durationMs": 142, "checkedAt": "..." },
    { ... }
  ]
}
```

HTTP status:
- `200` — overall OK
- `207` — at least one degraded probe
- `503` — at least one down probe
- `500` — couldn't run the probes (catastrophic)

Set up Pingdom / UptimeRobot to hit this URL. Any non-2xx is a real
alert.

## When something's wrong — the runbook

### "I see Redirecting… forever on /admin"

1. Open `/admin/system-health`. (Or `/api/admin/health` if even the
   dashboard fails.)
2. Find the first DOWN probe.
3. Apply the matching fix from
   [DATABASE_HEALTH.md → Recovery procedures](./DATABASE_HEALTH.md#recovery-procedures).
4. Restart the dev server if you changed env.
5. Refresh.

### "Login says invalid credentials but I'm sure they're right"

1. Open `/admin/system-health`. If status ≠ OK, the credential check
   never ran. Fix the upstream probe first.
2. If health is OK, run the verify utility:

   ```bash
   npm run db:create-admin -- email@example.com 'new-password' 'Name'
   ```

   This is idempotent — it resets the password AND clears any stale
   sessions for that user.

3. Try again with the new password.

### "Inbox / Audit / CRUD pages render but show empty"

1. Check `/admin/system-health` — if "Database connectivity" is OK but
   table-specific probes are degraded, that table has no rows. That's
   expected for a fresh deployment.

2. Repopulate seeded data: `npm run db:seed`. This is **destructive**
   on tables it manages — it wipes and reinserts. Don't run in
   production once real data exists.

### "AI assistant always returns the fallback message"

1. Check the "AI knowledge corpus" probe. If `docs: 0, faqs: 0` it has
   nothing to retrieve against — add content from `/admin/faqs` and
   `/admin/ai-docs`.

2. If the corpus is populated but retrieval still fails, check the
   `/api/chat` route logs and verify the request body is making it
   through.

## Architectural choices

### Health checks are non-blocking

Each probe runs in parallel via `Promise.all`. None can block another.
A frozen DB query won't lock up the dashboard.

### Probes own their own timeouts

Each probe wraps its async work in `withTimeout(p, 4000, label)`.
On timeout, the probe returns a structured `down` result with the
timeout message in `detail` — never throws.

### Probes never have side effects

Probes read; they don't write. A probe failing should not cause
cascading failure (no log inserts, no session touches).

### Categorization mirrors error classification

Health probe categories (infrastructure / configuration / auth / cms /
ai) align with error categories (infrastructure / configuration / etc.).
A "down" infrastructure probe and an "infrastructure" error category
point at the same root cause.

## What's NOT in the diagnostics layer (yet)

- **Metrics + time-series**: there's no Prometheus / OpenTelemetry
  export. Each probe is point-in-time only. A future phase adds
  rolling history.
- **Alerting**: the API returns the right status codes for external
  monitors; we don't have an internal alert manager.
- **Trace IDs**: requests don't yet carry a correlation ID through
  middleware → action → DB. A future phase adds request-scoped
  tracing.
- **Audit-log correlation**: the audit log records mutations; it
  doesn't tie back to a health snapshot at the time of the mutation.
  Useful if a mutation correlates with a degraded state.

These are intentional — observability has diminishing returns and the
current surface covers the failures we've actually seen in production.
