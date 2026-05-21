# CMS Models

Every table currently editable from the admin. All in Neon Postgres,
defined by Drizzle in [`src/lib/db/schema/`](../src/lib/db/schema/).

Each entry includes the table, the admin URL, the cache tag the
mutating server actions bust on save, and a one-line note.

## Identity tier — never user-facing

| Table | Admin | Tag | Notes |
|---|---|---|---|
| `admin_users` | (CLI) | — | PBKDF2 password hash. Bootstrap via `npm run db:create-admin`. |
| `admin_sessions` | (auto) | — | One row per active login. Cookie holds opaque token. |

## Content tier — public-facing

### Hero slides
- Schema: `hero_slides`
- Admin: [`/admin/hero`](/admin/hero) — list + create + edit + status toggle + delete
- Tag: `CACHE_TAGS.hero`
- Per-page hero block. Grouped by `scope` (`"home"`, etc.). The
  homepage hero reads the first published slide with scope = "home".

### Systems
- Schema: `systems` + `system_features` (inline edited as JSONB array)
- Admin: [`/admin/systems`](/admin/systems)
- Tag: `CACHE_TAGS.systems` + `CACHE_TAGS.services`
- Flagship products. Feature bullets are stored in `systems.highlights`
  JSONB; the system-grid renderer reads them directly.

### Services
- Schema: `services`
- Admin: [`/admin/services`](/admin/services)
- Tag: `CACHE_TAGS.services`
- Service offerings on `/services`.

### Statistics
- Schema: `statistics`
- Admin: [`/admin/statistics`](/admin/statistics)
- Tag: `CACHE_TAGS.statistics`
- Lookup by `key` (e.g. `schools_drais`). The key is locked after
  creation — the frontend depends on it.

### Testimonials
- Schema: `testimonials`
- Admin: [`/admin/testimonials`](/admin/testimonials)
- Tag: `CACHE_TAGS.testimonials`
- `featured = true` → "happiest client" callout on `/testimonials`.

### Team
- Schema: `team_members`
- Admin: [`/admin/team`](/admin/team)
- Tag: `CACHE_TAGS.team`
- Members on `/about`. Socials stored as JSONB `{linkedin, twitter, github}`.

### FAQs
- Schema: `faqs`
- Admin: [`/admin/faqs`](/admin/faqs)
- Tag: `CACHE_TAGS.faqs` + `CACHE_TAGS.aiDocs`
- Feeds both the public `/faq` page and Xhenvolt AI retrieval.

### Navigation
- Schema: `navigation_links`
- Admin: [`/admin/navigation`](/admin/navigation)
- Tag: `CACHE_TAGS.navigation`
- Top nav links + dropdowns. `parent_id` for two-level hierarchy.

### Footer links + social
- Schema: `footer_links`, `social_links`
- Admin: editable through Settings + per-record admin in Phase 7
- Tag: `CACHE_TAGS.footer` + `CACHE_TAGS.social`

### Pages
- Schema: `pages` + `sections`
- Admin: [`/admin/pages`](/admin/pages) (metadata only today)
- Tag: `CACHE_TAGS.pages`
- Page catalog + section composition. Section ordering UI ships in Phase 7.

### SEO metadata
- Schema: `seo_metadata`
- Admin: Phase 7
- Tag: `CACHE_TAGS.seo`
- Per-route title, description, OG. Currently editable via SQL or seed.

### AI training documents
- Schema: `ai_training_documents`
- Admin: Phase 7
- Tag: `CACHE_TAGS.aiDocs`
- Source-of-truth knowledge for Xhenvolt AI retrieval. `embedding`
  column is `vector(1536)`, populated once an embedding provider lands.

### Clients / Partners / Timeline / Gallery
- Schemas: `clients`, `partners`, `timeline_entries`, `gallery_images`
- Admin: Phase 7
- Tags: `CACHE_TAGS.clients`, `partners`, `timeline`, `gallery`

## Settings tier — JSONB blobs in `settings`

| Key | Schema | Admin | Notes |
|---|---|---|---|
| `contact` | `{ address, email, secondaryEmail?, hours?, phones[] }` | `/admin/settings` | Used by Footer + Contact page + AI knowledge. |
| `whatsapp` | `{ number, prefilledMessage, tooltip }` | `/admin/settings` | Floating CTA config. |
| `branding` | `{ companyName, tagline, foundedMonth, foundedYear, country }` | (no UI yet) | Used in copy fallbacks. |
| `floating_ui` | `{ order[], spacingPx, bottomOffsetPx, sideOffsetPx, mobileBreakpointPx }` | (no UI yet) | Stacking config for floating buttons. |
| `ai_assistant` | `{ name, introMessage, fallbackMessage, suggestions[] }` | `/admin/settings` | Xhenvolt AI config. |
| `cms:<key>` | per-section JSONB | (auto via section editor in Phase 7) | Generic storage for sections without a dedicated table. |

## Inbound tier — write-only from public site

| Table | Source | Admin | Notes |
|---|---|---|---|
| `contact_messages` | `/api/contact` | `/admin/messages` | Status workflow: new → in_progress → replied → archived. |
| `ai_conversation_logs` | `/api/chat` | (no UI yet) | One row per user turn + one per assistant turn, with matched IDs and latency. |

## Relations diagram

```
pages 1───* sections                       (page composition)
systems 1──* system_features               (legacy; today highlights is JSONB)
systems 1──* system_screenshots
testimonials *─1 systems  (system_id, optional — for filtering)
admin_users 1──* admin_sessions            (auth)
media_assets 1──* gallery_images           (linked via media_id)
```

## Cache tag registry

All tags live in [`src/lib/cache/safe.ts`](../src/lib/cache/safe.ts):

```ts
CACHE_TAGS = {
  systems, testimonials, services, clients, statistics, faqs,
  navigation, footer, social, hero, team, technologies, timeline,
  partners, settings, seo, announcements, pages, gallery, aiDocs,
}
```

Every server action that mutates content calls `revalidateTag(...)` on
the relevant tag. The public site picks the change up on the next
request (instant in development; bounded by tag invalidation on Vercel).
