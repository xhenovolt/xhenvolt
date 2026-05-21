# CMS Plan

## Goal

Eliminate developer dependence for content changes. Every word, image,
link, statistic, and metadata field that's visible on
[xhenvolt.com](https://xhenvolt.com) should be editable from `/admin`
by a non-engineer.

This is a multi-phase plan. Phase 5 (current) is **foundation only** —
the data model, registry, and admin shell exist. Live editing is not yet
shipped.

## Information model

### Storage tiers

1. **Dedicated tables** — first-class entities with rich admin UIs.
   - `testimonials`, `systems`, `system_features`, `system_screenshots`,
     `services`, `clients`, `partners`, `statistics`,
     `timeline_entries`, `team_members`, `technologies`, `faqs`,
     `navigation_links`, `footer_links`, `social_links`, `hero_slides`,
     `announcements`, `ai_training_documents`, `pages`, `sections`,
     `seo_metadata`, `media_assets`, `gallery_images`, `careers`,
     `categories`, `tags`
2. **JSONB on `settings`** — flat key/value blobs for content that
   doesn't justify a table.
   - Keys: `contact`, `whatsapp`, `branding`, `floating_ui`,
     `ai_assistant`
   - Future: `cms:<section_key>` blobs for any section without a
     dedicated table (managed via `src/lib/cms/storage.ts`)
3. **Inbound** — submissions that arrive from the public site.
   - `contact_messages`, `ai_conversation_logs`

### Section registry

`src/lib/cms/registry.ts` defines a stable interface for "what is
editable, where does it appear, what does it map to in the database, and
how is it edited?". Each registered section is a `SectionDefinition<T>`:

```ts
{
  key: "homepage_hero",
  label: "Homepage Hero",
  kind: "hero",
  routes: ["/"],
  description: "…",
  fields: [
    { key: "headline", label: "Headline", type: "text", required: true },
    { key: "subheadline", label: "Subheadline", type: "richtext" },
    { key: "ctaPrimaryLabel", label: "Primary CTA label", type: "text" },
    { key: "ctaPrimaryHref", label: "Primary CTA link", type: "link" },
    …
  ],
  resolve: async () => listHeroSlides("home").then(s => s[0] ?? null),
  fallback: { headline: "…", … },
  cacheTags: [CACHE_TAGS.hero],
}
```

Already registered:

- `homepage_hero` → resolves from `hero_slides` (scope="home")
- `site_testimonials` → resolves from `testimonials`

Section files live in `src/lib/cms/sections/*.section.ts` and are
imported by `src/lib/cms/sections/index.ts` to populate the registry.

### Editable wrapper

`<Editable sectionKey="homepage_hero">…</Editable>` is a server component
in `src/lib/cms/Editable.tsx`. Today it's a transparent pass-through for
visitors; for authenticated admins it adds `data-cms-section` and
`data-cms-edit-href` attributes that future client-side overlay code can
read to surface an inline edit button. **The wrapper is safe to scatter
through the site now** — it has zero visual or functional effect until
the overlay ships.

## What "editable" means per route

A first-pass inventory (deepen this as sections are registered):

| Route | Editable units |
|---|---|
| `/` | hero (eyebrow, headline, subheadline, tags, both CTAs), focus areas, system showcase, stat strip, testimonials grid, client logo carousel, timeline, "objection crusher" copy, final CTA |
| `/about` | hero, mission, vision, values, team, timeline |
| `/services` | hero, system cards (per system), proof points, CTA |
| `/testimonials` | hero, featured "happiest client", testimonial cards, stat strip |
| `/contact` | hero, contact info, form behavior, success message |
| `/faq` | FAQ list (per question/answer/category) |
| `/blog` | blog index, individual posts (each is a route today) |
| All routes | SEO title, description, keywords, OG image |
| Layout chrome | Nav links, dropdowns, footer columns, social links, WhatsApp CTA copy, Chatbot greeting + suggestions + fallback |

## Phasing

### Phase 5 (current) — Foundation
- ✅ All 31 tables created
- ✅ Repositories + cache wrapper
- ✅ Admin auth (DB-backed users + sessions)
- ✅ Admin shell with Sidebar + TopBar + breadcrumbs
- ✅ CRUD for testimonials, FAQs; editor for settings; inbox for messages
- ✅ Section registry + Editable wrapper scaffolding
- ✅ Route-group layout isolation

### Phase 6 — Cover the obvious gaps
1. Systems CRUD (per system, with feature list nested inline)
2. Services CRUD
3. Statistics CRUD (with `key` lock so the homepage stat strip doesn't
   break on rename)
4. Team members CRUD
5. Timeline entries CRUD
6. Clients CRUD
7. AI training docs CRUD (with markdown editor and category tagging)
8. Navigation / footer link editor (drag-to-reorder)
9. SEO metadata editor (route picker + OG image upload)
10. Image upload pipeline (Vercel Blob or S3 + media_assets writes)

### Phase 7 — Live editing
1. Render `<Editable>` overlays on the public site for authenticated
   admins (pencil icon, click → modal form, save → revalidateTag,
   reload section in-place)
2. Page-level draft / publish toggles
3. Section reordering on a page (`sections.sort_order` already exists)

### Phase 8 — Power features
1. Embeddings ingestion for `ai_training_documents` (vector column ready)
2. Multi-user team management (RBAC beyond the current single role)
3. Audit log
4. Scheduled publishing (`published_at` + cron)
5. Visual page builder MVP

## Founder-dependence elimination tracker

| Content domain | Hardcoded → DB? | Editable in admin? |
|---|---|---|
| Testimonials | ✅ | ✅ |
| FAQs | ✅ | ✅ |
| Settings (contact, whatsapp, AI) | ✅ | ✅ |
| Contact form submissions | ✅ inbox | ✅ |
| Nav links | ✅ | ✗ (Soon) |
| Footer links | ✅ | ✗ (Soon) |
| Systems | ✅ | ✗ (Soon) |
| Services | ✅ | ✗ (Soon) |
| Statistics | ✅ | ✗ (Soon) |
| Team | ✅ | ✗ (Soon) |
| Timeline | ✅ | ✗ (Soon) |
| Clients | ✅ | ✗ (Soon) |
| Homepage hero | ✅ | ✗ (Soon) |
| AI training docs | ✅ | ✗ (Soon) |
| SEO metadata | partial (top 5 routes) | ✗ (Soon) |
| Homepage hero text (inline) | ✗ still hardcoded | ✗ |
| Inline stat numbers on `/` | ✗ still hardcoded | ✗ |
| SystemsShowcase data | ✗ still hardcoded | ✗ |
| ClientLogosCarousel data | ✗ still hardcoded | ✗ |
| RealDeployments / ObjectionCrusher | ✗ still hardcoded | ✗ |
| Blog articles | ✗ still React components | ✗ |
| Per-route SEO (17 routes) | ✗ still static | ✗ |
