# Admin Operations

How the admin actually works day-to-day, and what changes when.

## Logging in

1. Visit `/admin` — middleware redirects to `/admin/login` if there's no
   valid session cookie.
2. Submit email + password.
3. The server looks up the email in `admin_users`, verifies the password
   via PBKDF2, inserts a row in `admin_sessions`, and sets a cookie
   holding the opaque session token.
4. The cookie has an 8-hour TTL; the `last_active_at` column on the
   session row is bumped on every authenticated request (sliding window).

To **add an admin**:

```bash
npm run db:create-admin -- email@example.com 'password' 'Display Name'
```

The command is idempotent — running it for an existing email resets
the password and invalidates all sessions for that user.

## What the dashboard does

`/admin` shows live row counts across the ten most-edited tables. Each
card is a link to the corresponding CRUD module. Counts come from
`SELECT count(*)` against Neon, wrapped in a 4-second timeout — if the
DB is unreachable the cards show "—" instead of failing the page.

## The 9 CRUD modules

Pattern is identical across every module:

```
/admin/<entity>/                ← list view
/admin/<entity>/new             ← create form
/admin/<entity>/[id]            ← edit form

src/app/admin/<entity>/
├── page.tsx                    ← list, uses AdminTable component
├── new/page.tsx                ← create
├── [id]/page.tsx               ← edit (fetches row, binds id into action)
├── _form.tsx                   ← shared form (props: action, initial?, submitLabel)
└── actions.ts                  ← "use server" — create/update/toggle/delete
```

Available modules:

| Entity | Module |
|---|---|
| Hero slides | [/admin/hero](/admin/hero) |
| Systems | [/admin/systems](/admin/systems) |
| Services | [/admin/services](/admin/services) |
| Statistics | [/admin/statistics](/admin/statistics) |
| Testimonials | [/admin/testimonials](/admin/testimonials) |
| FAQs | [/admin/faqs](/admin/faqs) |
| Team | [/admin/team](/admin/team) |
| Navigation | [/admin/navigation](/admin/navigation) |
| Pages | [/admin/pages](/admin/pages) |
| Settings | [/admin/settings](/admin/settings) |
| Inbox (read + status) | [/admin/messages](/admin/messages) |

## Draft / publish

Every CRUD form has a Status picker with two choices:

- **Published** — visible on the public site
- **Draft** — visible only in the admin

Internally this maps to the `published` boolean column (the
`pages.status` enum supports more states for richer workflows). The
public site filters `WHERE published = true` everywhere; drafts are
isolated by construction.

Soft-deleted records (`deleted_at IS NOT NULL`) are filtered out from
admin lists too. Restore requires a SQL update for now.

## Saving propagates within seconds

Every server action calls `revalidateTag(...)` for the relevant cache
tag immediately after `INSERT`/`UPDATE`. The site's `safeQuery` wrapper
keys reads against those tags, so the next request after a save
re-fetches from Neon. No deploys.

The full tag list is in [CMS_MODELS.md](./CMS_MODELS.md).

## Inbox workflow

`/admin/messages` shows incoming submissions from `/api/contact`. Each
row has a status (`new` → `in_progress` → `replied` → `archived`). A
single button on each card cycles to the next state. The page itself
revalidates via `revalidatePath("/admin/messages")` after every action.

## Authorization

Every server action calls `requireAdmin()` from
[`src/lib/auth/guard.ts`](../src/lib/auth/guard.ts) — middleware can be
bypassed by misconfiguration, the action layer cannot.

The guard has a future-proof `requireRole(minimum)` variant. Only
`admin` is used today. When RBAC ships, viewer/editor/admin tiers
already have rank values in code.

## Cache + revalidation

| Layer | Behavior |
|---|---|
| Public reads | `safeQuery(loader, { tags, fallback, timeoutMs })` — 4s timeout, typed fallback on error, `unstable_cache` in production with tag-based invalidation |
| Mutations | Server action → `db.insert/update/delete` → `revalidateTag(tag, "default")` → `redirect(...)` |
| Cross-table | When mutating systems we bust both `CACHE_TAGS.systems` and `CACHE_TAGS.services` because the services page reads system data. |
| Public webhook | `POST /api/revalidate` with `x-revalidate-secret` lets external integrations bust tags too |

## Error states

- **DB unreachable**: every list page wraps its `db.select(...)` in
  try/catch and returns `[]`. The empty-state UI shows; nothing crashes.
- **Session missing on action**: throws `unauthorized`. Next.js returns
  a 500 — the form re-submits if the user is re-authenticated.
- **Validation failure**: server action throws with the Zod error
  flattened in the message. The form re-renders with the user's input
  intact (Next form-action behavior).
- **Build-time fetches** with no DB available: prerender uses fallbacks.
  Vercel deployments with `DATABASE_URL` set work normally.

## Empty states

Every list page has an empty state via `AdminTable`: a friendly title,
a one-line hint, and a button linking to the "new" form. Specific
copy lives in the page that renders the table.

## What's missing / when

Phase 7 ships:

- Section composition UI for pages (drag-reorder hero / stat-grid / …)
- Live "edit this section" overlay on the public site
- Image upload (needs Vercel Blob / S3 wiring)
- AI training docs CRUD (the data model is ready)
- SEO metadata CRUD (the data model is ready)
- Drag-to-reorder on Navigation + Team + Timeline + Hero lists
- Audit log of admin actions
- Multi-user team UI (the role column is ready)
