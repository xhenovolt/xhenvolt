# Xhenvolt CMS — Next-Phase Recommendations

Prioritized by founder-independence value vs. effort. Each item is a *real* remaining gap from the audit, not a hypothetical.

## P1 — Media Library + uploads (Medium effort, high value)
Today image fields accept **URLs only**; `/admin/media` is an honest "Soon" stub. To make content truly self-service:
- Choose storage: Vercel Blob, S3/R2, or UploadThing (Hobby-friendly).
- Build `/admin/media`: upload, list, alt-text, delete; persist to existing `media_assets` table (already in schema).
- Add a media-picker to `fields.tsx` so every image field can pick from the library.
- Keep an honest warning until storage env is configured (never fake an upload).

## P2 — Dedicated newsletter subscribers model (Low effort)
Signups currently land in `contact_messages (source="newsletter")`. Add a `subscribers` table (email unique, status, interests, confirmedAt), migrate existing newsletter rows, and a `/admin/subscribers` list with CSV export. Optional double opt-in.

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
