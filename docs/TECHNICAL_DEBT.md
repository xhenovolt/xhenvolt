# Technical Debt

Live debts only — outdated/resolved items removed.

## Critical (founder-dependence risks)

### Hardcoded blog articles
Every post under `(website)/blog/<slug>/page.tsx` is a hand-written React
component. Adding or editing a post requires a developer + a deploy.

**Fix**: introduce a `posts` table (title, slug, excerpt, body markdown,
cover image, published_at, author, tags) and a single
`(website)/blog/[slug]/page.tsx` that fetches by slug.
Effort: ~1 sprint.

### Homepage hero text + inline statistics
`(website)/HomeClient.tsx` contains the hero copy and 6–10 inline stat
numbers (`<span>31</span>` etc.) baked into JSX. The hero is structurally
fragmented across three `<span>` elements with separate gradient/color
treatments, which is why Phase 2 deferred it.

**Fix**: refactor the hero markup into a single styled headline that
accepts text from `hero_slides` plus a small set of accent tokens. Pull
stats from `statistics` keyed by the same shortcodes already seeded
(`schools_drais`, `orgs_served`, etc.).
Effort: 2–3 days.

### SystemsShowcase, ClientLogosCarousel, RealDeployments, ObjectionCrusher
Four sizeable client components (~250–550 lines each) carry their own
hardcoded data arrays. They render on the homepage and elsewhere.

**Fix**: convert each to a prop-driven component with a server companion
that fetches `systems` / `clients` / `statistics`. The conversion
pattern is established (Navbar / Footer / TeamSection). Per-component
effort: 1–2 hours, but the data model is in place.

### SEO metadata on 17 routes
Only 5 routes (`/`, `/about`, `/services`, `/contact`, `/testimonials`)
read from the `seo_metadata` table. The rest still hardcode their
`export const metadata`.

**Fix**: replace each route's static `metadata` with `generateMetadata`
that calls `getSeoMetadata(routePath)`. Seed missing rows.
Effort: half a day for the whole batch.

## High (scalability + correctness)

### TypeScript strict mode is off
`tsconfig.json` has `strict: false`, `noImplicitAny: false`, etc. This
means real bugs can slip through. The new code (`src/lib/`, admin,
sections) is written defensively but the older code probably has nullable
issues hidden by loose typing.

**Fix**: flip `strict` on and clean up the resulting errors. Probably a
half-day of fixes.

### Hardcoded fallbacks inside prop-driven client components
`Navbar`, `Footer`, `TeamSection`, `WhatsAppCTA`, etc. all accept props
*and* carry a hardcoded `FALLBACK_*` constant for the case where props
are empty. This is intentional fault tolerance — the site stays up if
Neon is unreachable — but the fallback list will silently drift from the
DB over time (e.g. renaming a system).

**Mitigation**: a CI check that runs the seed against a scratch DB,
compares fallback constants to seed values, and fails on drift. Or
simply accept the drift — fallbacks are an availability story, not a
parity story.

### Duplicated data between hardcoded fallbacks and seed
The seed script (`scripts/seed.ts`) and the fallback constants describe
the same content twice. Any change has to be made in both places.

**Fix**: have the fallback constants import from the seed source of
truth, or vice-versa. Adds coupling but kills the duplication. Defer
until it actually causes a bug.

### Inbox has no notification
A visitor submits the contact form → it lands in `contact_messages` →
nothing happens. An admin has to actively check `/admin/messages`.

**Fix**: webhook to Slack / email on insert. Effort: a couple hours
once a provider is chosen.

## Medium

### No image upload pipeline
`media_assets` and `gallery_images` exist as tables, but there's no way
to upload an image through the admin. Logos, team avatars, OG images,
blog covers all still come from `/public/` static assets.

**Fix**: wire Vercel Blob (or S3). Add upload endpoint, drag-drop input,
and a media picker component. Effort: 1–2 days.

### Embeddings not generated
`ai_training_documents.embedding` is `vector(1536)` and NULL for every
row. The retrieval engine works on keyword overlap + LIKE. It performs
well for direct questions but falls down on paraphrased ones.

**Fix**: pick an embedding provider, write an ingest script, fill the
column on each doc save (server action hook).

### Rate limit on `/api/contact` is in-memory
The bucket lives in a JS Map. On Vercel with multiple instances it
under-counts. Fine for low traffic; switch to a Redis-backed counter
(Upstash) once traffic justifies it.

### Login attempt counter is in-memory too
Same caveat as above. With the small admin team, this is fine.

### OurJourney milestone events drift
The `timeline_entries.events` JSONB is editable in raw JSON only. There's
no admin UI for it yet — add to Phase 6.

## Low

### Lots of `*Client.tsx` components are huge
- `HomeClient.tsx` ~1370 lines
- `IntelligentChatbot.tsx` ~1100 lines
- `InteractiveProductStory.tsx` ~550 lines
- `DraisMicroDemo.tsx` ~500 lines

These work, but they violate single-responsibility. Splitting them is
risky (lots of animation choreography is intertwined) and not urgent.

### Legacy `IntelligentChatbot` local fallback responses
Inside the chatbot UI there's a ~400-line `generateIntelligentFallback`
function with hardcoded responses. It's a backup for when `/api/chat` is
unreachable. Now that the API is real and fast, the fallback can be
slimmed to just an error message that defers to WhatsApp.

### `.claude/settings.json` not committed
Contains the full Neon connection string in a Bash permission allow-list
from an earlier session. Not in git, but on disk. Scrub line 12 or
delete the file.

### Build warning: dynamic API in middleware
Neon HTTP queries from edge middleware are billed/timed per request.
Each `/admin/*` request triggers a session lookup against Neon. Current
volume is fine; if traffic grows, cache the session lookup with a
short TTL in `unstable_cache`.

## Resolved in Phase 5 (kept for history)

- ❌ Public `<Navbar>` showed on `/admin` → fixed via route-group layout isolation
- ❌ Auth used HMAC-signed cookies → replaced with DB-backed sessions
- ❌ Admin password lived in `.env` → replaced with `admin_users` table
- ❌ Nested `<html>` / `<body>` risk in admin layout → root is now bare,
  groups own their full chrome
- ❌ 22 page files each imported `<Navbar>` / `<Footer>` → all stripped;
  chrome lives in group layout
