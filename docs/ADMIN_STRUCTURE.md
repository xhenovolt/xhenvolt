# Admin Structure

## Goals

1. Feel like an enterprise dashboard, not a toy admin form.
2. Never inherit, render, or link to public chrome.
3. Be readable: a new admin can find any content type in one click.
4. Stay extensible: adding a new managed entity is a single file pattern.

## Layout

```
+--------------+--------------------------------------------------+
|              |  TopBar: Admin / Section / [page]    search box  |
|              +--------------------------------------------------+
|              |                                                  |
|  Sidebar     |  Main content (max-w-6xl, px-8 py-8)            |
|              |    PageHeader (title + description + action)     |
|  Overview    |    Content cards / tables / forms                |
|              |                                                  |
|  Content     |                                                  |
|  - Testim.   |                                                  |
|  - FAQs      |                                                  |
|  - Systems   |                                                  |
|  - …         |                                                  |
|              |                                                  |
|  Pages       |                                                  |
|  AI          |                                                  |
|  Operations  |                                                  |
|              |                                                  |
|  [avatar]    |                                                  |
|  View site   |                                                  |
|  Sign out    |                                                  |
+--------------+--------------------------------------------------+
```

## Component tree

```
src/app/admin/
├── layout.tsx                   ← shell: Sidebar + TopBar + main
├── _components/
│   ├── Sidebar.tsx              ← sectioned nav, icons, "Soon" badges
│   ├── TopBar.tsx               ← breadcrumbs from x-xhv-path, search stub
│   └── ui.tsx                   ← PageHeader, Card, Field, Input, Textarea,
│                                  Select, PrimaryButton, SecondaryButton,
│                                  DangerButton, StatusBadge, Toolbar
├── login/page.tsx               ← email + password, bypasses shell
├── page.tsx                     ← dashboard: row counts per content type
├── testimonials/
│   ├── page.tsx                 ← list + status toggle + delete
│   ├── new/page.tsx             ← create
│   ├── [id]/page.tsx            ← edit
│   ├── _form.tsx                ← shared form
│   └── actions.ts               ← server actions ("use server")
├── faqs/                        ← same pattern as testimonials
├── settings/
│   ├── page.tsx                 ← three forms: contact, whatsapp, ai_assistant
│   └── actions.ts
└── messages/
    ├── page.tsx                 ← inbox view + status cycle
    └── actions.ts
```

## Sidebar information architecture

Five labeled groups, each holding linked items:

1. **Overview** — Dashboard
2. **Content** — Testimonials, FAQs; Systems / Services / Clients / Team /
   Timeline / Media (marked "Soon" until built)
3. **Pages** — Pages, Navigation, SEO (Soon)
4. **AI** — Training Docs, Conversation Logs (Soon)
5. **Operations** — Inbox, Settings

The "Soon" badge rule: a sidebar link is either real and clickable, or
visibly disabled with a "Soon" badge. There are no broken links.

## Authentication & sessions

See [WEBSITE_ARCHITECTURE.md](./WEBSITE_ARCHITECTURE.md) for the
big-picture rendering flow. Auth specifics:

- `admin_users(id, email, password_hash, name, role, last_login_at, ...)`
  — admins live in the DB, not in env vars
- `admin_sessions(id, token, user_id, expires_at, last_active_at, ...)`
  — every active session is a row; the cookie holds an opaque 32-byte
  random token (no JWT, no signing)
- Password hashing: PBKDF2-SHA256, 210,000 iterations, 16-byte salt
  (Web Crypto only; edge-safe)
- Bootstrap: `npm run db:create-admin -- <email> <password> [name]`
  (idempotent: resets password and invalidates sessions if email exists)
- TTL: 8 hours, sliding window on `last_active_at`
- Middleware (edge runtime) verifies on every `/admin/*` request
- Server actions re-verify against the DB — defense in depth

## Server actions pattern

Every mutation lives in an `actions.ts` next to the page that calls it.
The pattern:

```ts
"use server";

import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "@/lib/auth/session";

async function requireAdmin() {
  const c = await cookies();
  const s = await verifySession(c.get(SESSION_COOKIE)?.value);
  if (!s) throw new Error("unauthorized");
}

export async function createX(fd: FormData) {
  await requireAdmin();
  const parsed = zSchema.safeParse(fromForm(fd));
  if (!parsed.success) throw new Error("invalid: " + ...);
  await db.insert(...).values(...);
  revalidateTag(CACHE_TAGS.xxx, "default");
  redirect("/admin/x");
}
```

Two invariants:
1. Every action calls `requireAdmin()` first.
2. Every successful mutation calls `revalidateTag(...)` so the live site
   reflects the change without a deploy.

## Adding a new managed content type

1. Add the schema to `src/lib/db/schema/<name>.ts` and re-export it.
2. `npm run db:generate` → review the SQL.
3. `npm run db:migrate` → apply against Neon.
4. Add a repository to `src/lib/repositories/<name>.repo.ts`.
5. Add a cache tag in `src/lib/cache/safe.ts` (`CACHE_TAGS`).
6. Optionally register a Section in `src/lib/cms/sections/`.
7. Build the admin pages under `src/app/admin/<name>/` following the
   `testimonials/` template (list, new, [id], _form.tsx, actions.ts).
8. Add it to the Sidebar groups in `_components/Sidebar.tsx` (or
   un-disable a "Soon" entry).

The pattern is mechanical enough that the next 6–8 entities should each
take well under an hour once the data model is fixed.

## Empty / loading / error states

The shell uses Next.js conventions:

- `loading.tsx` siblings (add per route as needed)
- `error.tsx` siblings catch runtime errors
- Empty data renders inline within each list page (e.g.
  "No testimonials yet — click + New")

## What's still missing (intentional defer to Phase 6+)

- Live "edit this section" overlays on the public site
- Image / file upload (needs Vercel Blob or S3 wiring)
- Multi-user team management UI (schema supports it; UI doesn't)
- Audit log (admins acting on data)
- Bulk actions in list views
- Drag-and-drop ordering UI (the `sort_order` columns already exist)
- Global search across content
