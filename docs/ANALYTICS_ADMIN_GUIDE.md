# Analytics — Admin Guide

Find it under **Analytics** in the admin sidebar. All pages have a range selector
(24h / 7 / 30 / 90 days) via `?range=`.

## Overview (`/admin/analytics`)
Top cards (each links to its detail page):
- **Human page views** — real visitor views (consented). The headline traffic number.
- **Unique visitors** — distinct `visitorId`s.
- **Downloads** — Cosmos download clicks (from `download_events`).
- **Tracked events** — CTA/outbound/call/email/download events.
- **Bot / crawler hits** and **Likely AI crawler hits** — server-detected.
- **Consent acceptance** — % of consent decisions that opted into analytics.
- **Total page views** — humans + bots combined.

Plus a **traffic trend** column chart and four lists: top pages, top sources,
devices, bots & AI crawlers.

## Detail pages
- **Pages** — most-viewed pages (humans).
- **Sources** — direct / organic / social / referral, derived from referrer.
- **Devices** — device type, browser, OS, country (country needs production
  Vercel geo headers; blank locally).
- **Bots & AI Crawlers** — AI vs search/social split + a recent-hits table.
- **Downloads** — Cosmos downloads grouped by app / platform / version.
- **Events** — top events + a recent-events feed.
- **Cookie Consent** — opt-in rates per category.

## How to read it
- **Low/zero human numbers but bot numbers present?** Normal early on — crawlers
  find you before people do, and humans must accept the **Analytics** cookie
  category before they're counted.
- **"Direct" dominates sources?** Common for typed URLs, app links, and clients
  that strip the referrer.
- **AI crawler counts** = "these crawlers fetched pages." See
  `AI_CRAWLER_TRACKING.md` for why that isn't proof of AI usage.
- **Country is blank in dev** — it only populates in production where Vercel
  injects geo headers.

## Caveats
- Numbers reflect **consented** human traffic + all bot traffic. They will be
  lower than a cookieless counter that tracks everyone.
- In-memory rate limits reset on serverless cold starts; that's fine for
  abuse-prevention but means limits aren't globally exact.
