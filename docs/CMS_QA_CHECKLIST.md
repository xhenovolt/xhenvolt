# Xhenvolt CMS — Manual QA Checklist

Run after every deploy or schema change. Requires a configured `.env.local` (TiDB) and `npm run dev`.

## 0. Pre-flight
- [ ] `npx tsc --noEmit` passes (no type errors).
- [ ] `npm run build` succeeds.
- [ ] `/admin/system-health` shows DB probe **OK** (real connection).

## 1. Auth
- [ ] Visiting `/admin` while logged out redirects to `/admin/login?next=...`.
- [ ] Login with valid admin credentials lands on the dashboard.
- [ ] `/admin/login` while logged out does **not** redirect-loop.
- [ ] "Sign out" clears the session; `/admin` redirects to login again.

## 2. Dashboard
- [ ] Cards show real counts (numbers, not "—" when DB is up).
- [ ] Clients / Statistics / Team / Timeline cards navigate to their modules (not back to `/admin`).
- [ ] AI Conversation Logs card is **not** clickable (honest stat).

## 3. CRUD persistence (spot-check 3 modules, e.g. Systems, FAQs, Testimonials)
- [ ] **Create:** form opens → submit invalid (blank required) → server rejects → submit valid → row appears in list.
- [ ] **Read:** list loads from DB; edit page pre-fills existing values.
- [ ] **Update:** change a field → save → list reflects it.
- [ ] **Publish/Draft:** set Draft → item disappears from the public site; set Published → reappears.
- [ ] **Delete/Archive:** soft-delete hides it from both admin list and public site.

## 4. Pages module (R1 regression)
- [ ] `/admin/pages/new` shows a **real form** (Title/Slug/Route/Status), not "coming soon".
- [ ] Creating a page persists and appears in `/admin/pages`.
- [ ] Editing that page saves changes.

## 5. Newsletter (R2 / R3 regression)
- [ ] `/newsletter`: submit with invalid email → inline validation error.
- [ ] Submit valid → success state; a new row appears in `/admin/messages` with source `newsletter`.
- [ ] Footer "Subscribe": invalid email → error; valid → success; row in Inbox.
- [ ] Rapid repeated submits → eventually rate-limited (HTTP 429), no crash.

## 6. FAQ (R4 regression)
- [ ] Add a published FAQ in `/admin/faqs` with a new category.
- [ ] `/faq` shows that FAQ under its category (CMS-driven).
- [ ] With DB reachable but zero published FAQs, `/faq` still renders the fallback set (never blank).

## 7. Public site reflects CMS
- [ ] Edit a testimonial / hero / service in admin → publish → corresponding public section updates (allow cache revalidation).
- [ ] Drafts/archived items are not visible publicly.

## 8. SEO
- [ ] A CMS-managed route's `<title>`/meta/OG come from `/admin/seo` where configured.
- [ ] `/cosmos` and `/cosmos/[slug]` have correct title + OG tags (view source).

## 9. Cosmos / downloads
- [ ] `/cosmos` lists only **published** apps; drafts hidden.
- [ ] `/cosmos/[slug]` renders app detail, platforms, checksum (if set).
- [ ] `/download/[slug]` issues a **302 redirect** to the GitHub asset (check Network tab — no large body served by the site).
- [ ] Admin "Verify URL" rejects a non-allow-listed host; saving an unsafe URL is blocked.
- [ ] A bad slug → `/download/bad` redirects to `/cosmos?error=...` (no crash).

## 10. Resilience
- [ ] Temporarily break DB creds → public pages still render (fallbacks), admin shows the "Database connection unavailable" panel, no white-screen.
