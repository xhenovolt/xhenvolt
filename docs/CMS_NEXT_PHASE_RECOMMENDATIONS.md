# Xhenvolt CMS — Next-Phase Recommendations

Prioritized by founder-independence value vs. effort. Each item is a *real* remaining gap from the audit, not a hypothetical.

## P1 — Media Library + uploads (registry DONE; upload pending storage)
**Done (2026-06-24):** `/admin/media` registry over `media_assets` (add by hosted
URL, alt/title/dimensions, grid browse, soft delete). Session-gated list API
(`/api/admin/media`) + reusable `MediaPicker` (URL input + "pick from library"
modal), wired into the Cosmos app icon field as the reference integration. The
sidebar item is now live (no longer "Soon"). An honest banner states device
upload needs a storage backend.

**Remaining (needs your decision + credentials):**
- Choose storage: Vercel Blob, Cloudflare R2/S3, or UploadThing.
- Add an upload route that streams to that backend and writes a `media_assets`
  row (url, mimeType, width/height, sizeBytes) — then drop the "device upload"
  banner.
- Roll `MediaPicker` into the remaining image fields (hero, team avatar,
  systems/services logos, testimonial avatar). The component is ready; wiring is
  mechanical.

## P2 — Dedicated newsletter subscribers model ✅ DONE (2026-06-24)
Built: `subscribers` table (email unique, status, interests, source, ipHash). `/api/newsletter` now upserts on email (no duplicates; repeat signup re-subscribes + refreshes interests). Admin `/admin/subscribers` lists subscribers with status toggle, delete, and **CSV export** (`/api/admin/subscribers/export`, session-gated). One-time migration `scripts/migrate-newsletter-to-subscribers.ts` moves legacy `contact_messages(source=newsletter)` rows out of the Inbox. *Remaining optional:* double opt-in / confirmation email.

## P3 — AI Conversation Logs viewer (Low effort)
Data already writes to `ai_conversation_logs`. Build the read-only `/admin/ai-logs` viewer (paginated, searchable) and flip the sidebar item from `disabled`. Removes the last "Soon" in Operations.

## P4 — Page section composition / visual builder (High effort)
`PageForm` manages page metadata; section layout is code (`app/(website)/<route>/page.tsx`). A real builder = ordered, typed section blocks per page persisted to `page_sections` and a generic renderer. Large; the CMS section service (`src/lib/cms/`) is the right foundation. Stage it: (a) section list CRUD per page, (b) drag-order, (c) live preview.

## P5 — RBAC user management UI (Medium effort)
`requireRole()` and `admin_users.role` exist but there's no UI. Build `/admin/users` (invite, set role admin/editor/viewer, deactivate) and enforce `requireRole("admin")` on destructive actions. Only needed as the team grows.

## P6 — Migrate static SEO pages to CMS (Large, content-led)
The ~12 location landing pages, 10 blog posts, and legal pages are hand-coded. Model them (`pages` + section content or a `posts` table) so marketing can edit without deploys. Do this carefully to avoid SEO regressions — keep slugs, metadata, and structured data identical.

## P7 — Draft preview links (Medium effort)
Add signed preview tokens so admins can view unpublished content on the live site (`?preview=<token>`), gated by session. Foundation only today (published/draft filtering works).

## P8 — Cosmos roadmap (tracked separately)
See `FUTURE_ROADMAP.md`: GitHub API auto-sync of releases, per-platform auto-detection, signed releases, desktop auto-updater feed via `/api/cosmos/resolve`, CDN migration.

---

### Suggested order
P3 → P2 → P1 → P5 → P7 → P4 → P6 (P8 parallel, product-driven).
P3/P2 are quick honesty wins; P1 unlocks real content independence; P4/P6 are the big founder-independence levers.
