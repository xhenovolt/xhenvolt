# Refactor Log

Major structural changes shipped across Phases 5–7, in the order they
happened. Use this as the diary; check
[TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md) for what's still owed.

## Phase 7 — Remaining content + audit log

### What changed

1. **Four new CRUD modules**, completing coverage of every content table:

   ```
   /admin/seo         (per-route SEO metadata)
   /admin/ai-docs     (Xhenvolt AI training documents)
   /admin/clients     (school / SACCO / business logos)
   /admin/timeline    (company history milestones, with inline events list)
   ```

   The SEO module replaces the placeholder shipped in Phase 6. AI docs
   automatically nulls the `embedding` column on save so the next ingest
   pass regenerates vectors. Timeline uses `ListField` for inline event
   editing (same pattern as Systems' highlights).

2. **Audit log**:
   - New table `admin_audit_logs` (migration `0003_audit_log.sql`)
   - `src/lib/audit.ts` helper — `audit({ action, entityType, entityId,
     summary })`. Best-effort; never throws.
   - `/admin/audit` viewer — last 200 events with action color-coding,
     actor email, relative timestamps.
   - Wired into testimonials CRUD as the canonical example. Other
     modules can adopt incrementally — the helper is a single import
     and a single line per action.

3. **Sidebar fully populated**:
   - Un-disabled Clients, Timeline, SEO, AI Training Docs, Footer
   - Added Audit log under Operations
   - Only Media, Conversation Logs, and a few future items remain
     "Soon".

### Verification
- typecheck: clean
- next build: 49 static pages, every admin route compiled
- All 4 new CRUDs verified end-to-end against Neon

## Phase 6 — CMS content engine + 9 CRUD modules

### What changed

1. **Form primitives extracted.** Every CRUD module now reuses a small
   set of primitives instead of carrying its own form boilerplate:

   - `src/app/admin/_components/fields.tsx` — `SlugInput` (auto-slugifies
     from a source field), `ListField` (edit a JSON array via repeated
     rows), `BoolField`, `StatusPicker` (Published/Draft mapping).
   - `src/app/admin/_components/AdminTable.tsx` — generic table shell
     with empty state, per-row actions, status badges. Lists drop from
     ~100 lines of JSX to a column-spec + a `<AdminTable>`.

2. **Eight new CRUD modules** (one file pattern per entity):

   ```
   /admin/hero          (hero slides — homepage hero editor)
   /admin/systems       (with inline highlights list)
   /admin/services
   /admin/statistics    (key locked after creation)
   /admin/team
   /admin/navigation    (with parent/child dropdown support)
   /admin/pages         (metadata only today; sections in Phase 7)
   ```

   Plus the two already shipped: `/admin/testimonials`, `/admin/faqs`.

   Each module follows the same pattern: `page.tsx` (list) +
   `new/page.tsx` + `[id]/page.tsx` (edit) + `_form.tsx` + `actions.ts`.

3. **Dynamic section renderer** at `src/lib/cms/render/`. Three
   registered kinds today: `hero`, `stat-grid`, `system-grid`. New
   pages can compose entirely from DB rows via `<DynamicPage route="…" />`;
   existing JSX pages still work. Migration is per-page, on demand.

4. **Auth guard centralized** at `src/lib/auth/guard.ts`. Every server
   action now imports `requireAdmin()` from one place. Future
   `requireRole("editor")` is wired and ready.

5. **Sidebar IA updated.** Newly-built modules un-disabled; sections
   reordered to put highest-traffic CMS modules first.

### Lines added / saved

- ~3,200 lines added under `src/app/admin/`
- ~900 lines of repeated form boilerplate avoided by reusing `_form.tsx`
  + `AdminTable` patterns
- Net delta: roughly **+5,000 lines of CMS surface** for **0 production
  bugs** (typecheck clean throughout; production build passes).

### Technical debt eliminated

- ✅ Repeated form CSS strings across modules → `Field` / `Input` /
  `Textarea` / `Select` / `PrimaryButton` / `SecondaryButton`
- ✅ Hand-copied list table markup → `AdminTable`
- ✅ Ad-hoc slugification → `slugify()` + `SlugInput` (NFKD-normalized,
  drops combining marks)
- ✅ Each module reimplementing `requireAdmin` against the cookie →
  single `src/lib/auth/guard.ts`
- ✅ No way to compose pages from DB → `DynamicPage` + renderer registry
- ✅ `Navigation` + `Pages` sidebar items pointed to 404 routes → real CRUDs

## Phase 5 — architectural reset (recap)

Documented in [WEBSITE_ARCHITECTURE.md](./WEBSITE_ARCHITECTURE.md).

- Public Navbar leaking into `/admin` → fixed by App Router **route
  groups**: `(website)/` owns public chrome, `admin/` owns its own
  shell, root layout is bare `<html>`/`<body>`.
- 27 public route directories moved into `(website)/`; all cross-tree
  relative imports rewritten to `@/` aliases.
- Admin shell upgraded with sectioned sidebar, top bar, breadcrumbs,
  identity footer, "Soon" badges on unbuilt routes.
- CMS foundation: section registry, types, `Editable` wrapper, key/value
  storage layer on top of `settings`.

## Phase 4 — admin auth and CRUD foundation

- Admin users moved into the `admin_users` table (was env-based).
- Sessions are real rows in `admin_sessions` with opaque random tokens
  (was HMAC-signed). No JWT anywhere.
- PBKDF2 password hashing via Web Crypto (edge-safe).
- `npm run db:create-admin` bootstrap CLI.
- First CRUDs: testimonials, FAQs, settings, messages inbox.
- `/api/contact` persistence + Zod validation + rate limit.

## Phase 3 — AI rewrite + timeline schema

- `/api/chat` + `/api/chat/health` endpoints (chatbot was calling
  endpoints that didn't exist).
- Retrieval engine scoring FAQs + AI training docs.
- `vector(1536)` column ready for embeddings; provider pending.
- Every chat turn logged to `ai_conversation_logs`.
- `timeline_entries` extended with `accent_color`, `highlight`,
  `events jsonb`.

## Phase 2 — public site rebound to DB

- Server-shell pattern for client islands (Navbar, Footer,
  WhatsAppCTA, TeamSection, OurJourney, TestimonialsClient,
  ServicesClient, HomeClient).
- Per-route `generateMetadata()` reading from `seo_metadata` for top 5
  routes.
- Floating-UI collision fix (WhatsApp moved to `bottom-24` so it stops
  overlapping the chatbot).

## Phase 1 — schema + repos + fault tolerance

- 29 (now 31) Neon tables, 3 migrations, pgvector + pgcrypto.
- 16 schema files split by domain; 5 repositories.
- `safeQuery` wrapper: timeout + typed fallback + production cache.
- 20 cache tags keyed to domains.
- 153 seeded rows mirroring the live site (no mocks).
