# Xhenvolt Analytics Engine

First-party, privacy-aware analytics built into the website + CMS. No third-party
analytics scripts, no Prisma — this project uses **Drizzle ORM + TiDB**.

## Architecture

```
Human visitor ──(consent: analytics)──► AnalyticsProvider (client)
                                          │ navigator.sendBeacon
                                          ▼
                               /api/analytics/pageview   ─┐
                               /api/analytics/event       ├─► TiDB (Drizzle)
                               /api/analytics/consent     ─┘

Bot / AI crawler ──► Edge middleware (UA detect) ──event.waitUntil──►
                               /api/analytics/bot-hit ──► TiDB
```

- **Humans** run the client tracker (consent-gated). UA/device/bot fields are
  derived **server-side** from the real request headers, never trusted from the
  client body.
- **Bots** don't run JS, so middleware detects them by User-Agent and fires a
  non-blocking internal request to `/api/analytics/bot-hit`. Public pages stay
  statically rendered — no DB work happens in the page render path.

## Database models (Drizzle — `src/lib/db/schema/analytics.ts`)

- `analytics_page_views` — path, title, referrer, source/medium/campaign, UA,
  deviceType, browser, os, country, city, ipHash, sessionId, visitorId, isBot,
  botName, isAiCrawler, aiCrawlerName, createdAt. Indexed on path, createdAt,
  visitorId, sessionId, isBot, isAiCrawler.
- `analytics_events` — eventType, eventName, path, target, metadata(JSON),
  sessionId, visitorId, createdAt.
- `cookie_consents` — visitorId, necessary, analytics, marketing, preferences,
  consentVersion, ipHash, createdAt/updatedAt (latest row per visitor wins).
- `analytics_daily_summary` — foundation for a future rollup job (unused; the
  dashboard aggregates on the fly over indexed columns).
- **Downloads are not duplicated** — they live in `download_events`
  (`schema/cosmos.ts`) and the dashboard reads them there.

Migration: `drizzle/0003_*.sql` (run via `npm run db:migrate`).

## Endpoints (`src/app/api/analytics/*`)

| Endpoint | Who calls it | Notes |
|---|---|---|
| `POST /pageview` | client provider | consent-gated; UA parsed server-side; rate-limited per ipHash; returns 204 |
| `POST /event` | client provider | CTA/outbound/form/download/custom; metadata capped at 2 KB |
| `POST /consent` | cookie banner | upserts latest consent row per visitorId |
| `POST /bot-hit` | middleware only | token-guarded; logs bot/AI-crawler page hits |

All endpoints **fail soft** (return 204 on any error) so the public site never
breaks because of analytics.

## Client tracker (`src/components/analytics/AnalyticsProvider.tsx`)
- Tracks a page view on every route change (consent permitting).
- One global capture-phase click listener handles **all** CTA tracking:
  - elements with `data-track="<name>"` (+ optional `data-track-type`, `data-track-target`)
  - outbound links, `tel:` and `mailto:` automatically
- API: `useAnalytics()` → `trackEvent(name, opts)`, `trackDownload({appSlug,...})`.
- Uses `navigator.sendBeacon` → never blocks navigation.

## Performance
- Static pages stay static; no per-render DB writes.
- Beacons are tiny and async; events are capped and rate-limited.
- Bot logging is `event.waitUntil` (doesn't delay the response).

## Env
- `ANALYTICS_INTERNAL_TOKEN` — shared secret for `/bot-hit` (defaults to
  `internal`; set a random value in production).
- `ANALYTICS_IP_SALT` — salt for daily IP hashing (falls back to `COSMOS_IP_SALT`).
