# Xhenvolt CMS — Forensic Audit Report

**Date:** 2026-06-24
**Scope:** Full website CMS, admin panel, public site, auth, Cosmos module.
**Method:** Static code tracing of the real data path (Admin UI → server action → Drizzle repository → TiDB → public render). No assumptions; every finding below is backed by a file.

> **Stack correction:** The brief referenced *Prisma*. This project does **not** use Prisma. It uses **Drizzle ORM** over **mysql2/TiDB Serverless** (`src/lib/db/`). All findings and fixes are Drizzle-accurate.

---

## 1. Executive summary

The CMS is **substantially real and healthy**, not a façade. 18 of the admin modules have working `actions.ts` server actions that validate (zod) and persist to TiDB, guarded by `requireAdmin()`. Auth, sessions, settings, SEO, and system-health are genuine.

The audit found **5 concrete defects** — a mix of one dead admin stub, two fake/dead public forms, one CMS-disconnected public page, and misrouted dashboard links. **All 5 were repaired** this phase. No working module was modified beyond what each fix required. Remaining gaps (media uploads, RBAC user management, page-section composition) are **genuinely unbuilt** and are documented honestly rather than faked.

Overall risk level after repairs: **LOW**.

---

## 2. Architecture map (verified)

| Layer | Reality |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack), React 19 |
| ORM / DB | Drizzle ORM + mysql2 → TiDB Serverless (TLS). `src/lib/db/index.ts` singleton, `hasDb()` graceful-degrade |
| Schema | `src/lib/db/schema/*.ts` (per-domain), barrel `index.ts` |
| Public reads | `src/lib/repositories/*.repo.ts` via `safeQuery()` (timeout + fallback + tag cache) |
| Writes | Per-module `actions.ts` (`"use server"`, zod, `requireAdmin()`, `revalidateTag()`) |
| Auth | Opaque session token in cookie → `admin_sessions` row (`src/lib/auth/session.ts`). Middleware = cookie presence gate; `(authed)/layout.tsx` = DB-backed re-check |
| Admin shell | `(authed)/layout.tsx` + `_components/` (Sidebar, AdminTable, ui, fields) |
| Public shell | `(website)/layout.tsx` (Navbar/Footer servers, SEO defaults) |
| Health | `src/lib/health/` real probes, surfaced at `/admin/system-health` |

---

## 3. Module-by-module status (see CMS_FEATURE_MATRIX.md for the grid)

### Working (verified persisting to TiDB)
Hero, Systems, Services, Statistics, Testimonials, Team, FAQs (admin), Clients, Timeline, Navigation, Footer, SEO, Settings, AI Training Docs, Messages/Inbox, Audit log (read), System Health (read), **Cosmos Apps/Releases/Downloads** (built prior phase).

### Defects found & fixed (detail in CMS_REPAIR_LOG.md)
1. **Pages → "New" was a dead stub.** `pages/new/page.tsx` rendered "Page builder coming soon" even though `createPage()` and the shared `PageForm` were fully implemented and used by the working edit route. Admins literally could not create pages. **→ Fixed:** new route now renders the real `PageForm` bound to `createPage`.
2. **Newsletter form faked success.** `(website)/newsletter/page.tsx` used `setTimeout(...)` with a `// Simulate form submission` comment and never persisted. **→ Fixed:** posts to new `/api/newsletter`, which stores to `contact_messages (source="newsletter")` and surfaces in the admin Inbox.
3. **Footer "Subscribe" was a dead button.** `components/Footer.tsx` had an email input + button with no handler. **→ Fixed:** real `FooterSubscribe` client form posting to `/api/newsletter` with loading/success/error states.
4. **Public FAQ page ignored the FAQ CMS.** `(website)/faq/page.tsx` rendered a hardcoded array while `/admin/faqs`, `listFaqs()`, and the `faqs` table all existed — a true CMS disconnect. **→ Fixed:** page is now a server component reading `listFaqs("public")`, grouped by category, with the old content preserved as a fallback when the CMS is empty/offline.
5. **Dashboard cards linked to `/admin`.** Clients, Statistics, Team, Timeline cards pointed at the dashboard instead of their (existing) modules; AI Conversation Logs linked nowhere real. **→ Fixed:** correct hrefs for the four; the logs card is now an honest non-clickable stat (no viewer exists yet).

### Honestly incomplete (NOT faked — flagged in UI and docs)
- **Media Library** (`/admin/media`): sidebar item is explicitly `disabled` + "Soon". No upload storage is configured. Left honest.
- **AI Conversation Logs viewer**: sidebar `disabled` + "Soon"; dashboard card now non-clickable.
- **Page section composition**: `PageForm` itself states section content is code-rendered (Phase 7). Metadata CRUD works; visual section builder does not exist.
- **User/Role management**: no `/admin/users` route. Single-role (`admin`) model; `requireRole()` scaffolding exists but no UI. Not in sidebar, so no dead link.
- **Appearance/theme settings**: theme is a client/localStorage toggle; no CMS module.

---

## 4. Public site: CMS vs intentional static

CMS-driven: `/` (home), `/about`, `/services`, `/testimonials`, `/contact`, `/faq` (now), `/cosmos`, `/cosmos/[slug]`.

**Intentionally static (documented, not a defect):** the ~12 location/SEO landing pages (`attendance-system-*`, `biometric-attendance-uganda`, `school-*`), the 10 blog articles, legal pages (`privacy-policy`, `terms-of-service`), `security`, `reliability`, `support`, `training`, `device-integration`, `case-studies`, and the bespoke `drais-attendance-system` landing. These are hand-authored SEO/marketing surfaces; converting them to CMS is a future content-modeling decision, **not** a stabilization fix, and doing so blindly would risk SEO regressions.

---

## 5. Security & infra posture (verified, unchanged)

- `/admin/*` gated by middleware (cookie) **and** re-checked in `(authed)/layout.tsx` (DB session). `/admin/login` correctly bypasses the authed layout (no redirect loop).
- All write actions call `requireAdmin()`.
- Cosmos downloads are **redirect-only** to allow-listed hosts; no binary is proxied through Vercel (`src/lib/cosmos/urls.ts`, `/download/[slug]` route). Re-validated at redirect time (defense in depth).
- `contact`/`newsletter` APIs rate-limit and hash IPs; no raw IP stored.
- DB unavailability degrades gracefully (`hasDb()`, `safeQuery` fallbacks) rather than crashing.

---

## 6. Remaining risks

| Risk | Severity | Note |
|---|---|---|
| Media uploads unbuilt | Medium | Image fields take URLs only; no upload pipeline. Honest "Soon" in sidebar. |
| No RBAC UI | Low | Single admin role today; fine for current team size. |
| Newsletter stored in `contact_messages` | Low | Pragmatic; migrate to a dedicated `subscribers` table later. |
| Static SEO pages not CMS-managed | Low | Intentional; edits require code deploy. |
| Page section builder absent | Medium | Page metadata is editable; layout is code. |

See **CMS_NEXT_PHASE_RECOMMENDATIONS.md** for the prioritized path forward.
