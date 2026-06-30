# Privacy Notes

What the Xhenvolt Analytics Engine tracks, anonymizes, and deliberately does not.

## Principles
- First-party only. No third-party analytics scripts, no ad networks, no data selling.
- Business intelligence, not surveillance.
- Minimize personal data; anonymize what we keep.

## What is tracked (humans, after analytics consent)
- Page path, page title, referrer, derived source/medium, UTM params (if present).
- Device type, browser, OS — bucketed from the User-Agent.
- A first-party `visitorId` (random; localStorage) and per-tab `sessionId`.
- Country/city **only in production** from Vercel geo headers (coarse, IP-derived).
- CTA/outbound/call/email/download events you trigger on the site.

## What is anonymized / NOT stored
- **Raw IP addresses are never stored.** We store only a **daily-salted SHA-256
  hash** (`ipHash`) — it rotates every day and is not reversible to an address.
- No names, emails, or account identities are attached to analytics rows.
- `visitorId` is a random opaque id, not tied to any personal identity.
- Event metadata is capped (2 KB) and is data you choose to attach.

## Consent model (cookieless-first, Plausible/Fathom style)
- **Anonymous page views are counted without cookies or consent.** Before any
  consent choice we record path/referrer/device/country only — **no persistent
  visitorId, no sessionId, no cookie** — so the owner sees complete traffic
  while no individual is identified or tracked across pages.
- **The "Analytics" consent category enables identity, not basic counting.** Once
  granted, a first-party `visitorId`/`sessionId` is attached (for unique-visitor
  and journey analysis) and CTA/event tracking turns on.
- **Marketing/Preferences** gate their respective features.
- Consent choices are stored locally and as a server audit row (`cookie_consents`)
  used only to report acceptance rates.
- Reject = page views are still counted **anonymously and cookielessly**; no
  persistent identity or event tracking occurs.

> If your policy requires *no* analytics at all before consent, revert this by
> re-adding the `consentRef.current` guard at the top of `logPageView()` in
> `AnalyticsProvider.tsx`.

## Bots / AI crawlers
- Logged server-side from the User-Agent (no cookies, no JS, no personal data).
- We record a coarse `ipHash` and the declared crawler name only.
- See `AI_CRAWLER_TRACKING.md` — a crawler hit is **not** proof an AI used our content.

## Data retention
- Raw events/page-views accumulate in TiDB. For a Hobby footprint, periodically
  prune old rows (e.g. keep 12 months) or build the `analytics_daily_summary`
  rollup and delete raw rows past a window. (Rollup job is scaffolded, not yet run.)

## Your obligations
Keep the public privacy policy aligned with this: first-party analytics, hashed
IPs, consent-gated, no selling. If you add marketing pixels later, update both the
banner copy and this document.
