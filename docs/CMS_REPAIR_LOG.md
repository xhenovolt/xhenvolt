# Xhenvolt CMS — Repair Log

Exact changes made during the 2026-06-24 stabilization phase. Each entry: problem → root cause → fix → files. All changes typecheck clean (`npx tsc --noEmit`).

---

## R1 — Pages "New" was a non-functional stub
- **Problem:** `/admin/pages/new` showed "Page builder coming soon"; admins could not create pages.
- **Root cause:** The page rendered a placeholder even though `createPage()` (server action) and `PageForm` (shared form) were complete and already used by the working `/admin/pages/[id]` edit route.
- **Fix:** Replaced the stub with the real `PageForm` bound to `createPage`.
- **Files:** `src/app/admin/(authed)/pages/new/page.tsx` (rewritten).
- **Risk:** None — reuses already-proven action + form.

## R2 — Newsletter form faked success
- **Problem:** `/newsletter` showed "subscribed" via `setTimeout`; nothing was saved (`// Simulate form submission`).
- **Root cause:** No backend endpoint existed; the handler was a placeholder.
- **Fix:** Created `POST /api/newsletter` (rate-limited, zod-validated, IP-hashed) that inserts into `contact_messages` with `source="newsletter"` and `metadata.interests`. Rewired the page handler to call it and surface real success/error states.
- **Files:** `src/app/api/newsletter/route.ts` (new); `src/app/(website)/newsletter/page.tsx` (handler).
- **Why `contact_messages`:** No dedicated `subscribers` table yet; this reuses the existing admin Inbox so signups are immediately visible. Flagged for future migration.

## R3 — Footer "Subscribe" was a dead button
- **Problem:** Footer email input + Subscribe button had no behavior.
- **Root cause:** Markup only; no handler.
- **Fix:** Added `FooterSubscribe` client component (in the already-`"use client"` Footer) posting to `/api/newsletter`, with loading spinner, success confirmation, and inline error.
- **Files:** `src/components/Footer.tsx`.
- **Risk:** None — Footer was already a client component; no server contract changed.

## R4 — Public FAQ page bypassed the FAQ CMS
- **Problem:** `/faq` rendered a hardcoded array; editing `/admin/faqs` had no effect on the public page.
- **Root cause:** The page predated the FAQ CMS and was never wired to `listFaqs()`.
- **Fix:** Split into a server `page.tsx` (reads `listFaqs("public")`, groups by category, adds metadata) + a `FaqClient.tsx` view. The original curated content is preserved as `FALLBACK_FAQS` and used only when the CMS returns nothing (DB offline / not seeded) — so the page is never empty and never regresses.
- **Files:** `src/app/(website)/faq/page.tsx` (now server); `src/app/(website)/faq/FaqClient.tsx` (new client view).
- **Risk:** Low — visual output identical; data source added with safe fallback.

## R5 — Dashboard cards linked to `/admin`
- **Problem:** Clients/Statistics/Team/Timeline cards linked to the dashboard itself; AI Conversation Logs linked nowhere real.
- **Root cause:** Placeholder hrefs left in the `CARDS` array.
- **Fix:** Pointed the four cards at their real modules (`/admin/clients`, `/admin/statistics`, `/admin/team`, `/admin/timeline`). Made `href` nullable; the AI Conversation Logs card now renders as a non-clickable stat with a "no dedicated admin page yet" title (honest — a viewer doesn't exist).
- **Files:** `src/app/admin/(authed)/page.tsx`.
- **Risk:** None.

---

## Not changed (deliberately)
- Working modules (Hero, Systems, Services, Settings, SEO, Navigation, Footer links, Testimonials, Team, Statistics, Timeline, Clients, AI Docs, Messages, Audit, System Health, Cosmos) — left untouched.
- Intentionally static SEO/marketing/legal/blog pages — documented in the audit, not converted.
- Media uploads, RBAC UI, page-section builder — out of stabilization scope; flagged honestly rather than faked.
