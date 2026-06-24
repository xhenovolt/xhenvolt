# Xhenvolt Cosmos — Architecture

Cosmos is the official software release center for Xhenvolt products (DRAIS
Desktop, etc.). It is a CMS-managed app store with a **branded download
resolver** that redirects to GitHub release assets so large binaries never
consume Vercel bandwidth.

## Stack alignment

Cosmos uses the project's existing stack — **no new dependencies**:

- **Next.js 16** App Router (route groups `(website)` and `admin/(authed)`)
- **Drizzle ORM** over **mysql2 / TiDB Serverless** (NOT Prisma)
- `safeQuery` cache wrapper + `revalidateTag` invalidation
- Existing admin auth (`requireAdmin`, DB-backed sessions)
- Tailwind v4, lucide-react

## Data models (`src/lib/db/schema/cosmos.ts`)

| Table             | Purpose                                             |
| ----------------- | --------------------------------------------------- |
| `app_products`    | One row per downloadable product                    |
| `app_releases`    | Every build/asset for a product (GitHub URL lives here) |
| `download_events` | Anonymized download-intent log (clicks, not bytes)  |

Status model: `draft | published | archived`. Only `published` is publicly
visible. `app_releases.is_latest` is unique per `(app, platform, channel)` —
enforced in the release server actions.

Migration: `drizzle/0001_vengeful_luminals.sql` (applied via `npm run db:migrate`).

## Public routes (`src/app/(website)/`)

| Route             | Description                                  |
| ----------------- | -------------------------------------------- |
| `/cosmos`         | Store: hero, featured, app grid, trust, roadmap |
| `/cosmos/[slug]`  | App detail: releases per platform, checksum, notes |
| `/store`          | Permanent redirect → `/cosmos`               |

## Download + API routes (route handlers — no layout, no page chrome)

| Route                          | Description                                   |
| ------------------------------ | --------------------------------------------- |
| `/download/[slug]`             | Resolver → 302 to latest release asset        |
| `/download/[slug]/[platform]`  | Platform-specific resolver → 302              |
| `/api/cosmos/resolve`          | Metadata-only JSON (for auto-updaters)        |
| `/api/admin/cosmos/verify`     | Admin-only URL safety + HEAD reachability check |

## Admin routes (`src/app/admin/(authed)/cosmos/`)

| Route                         | Description                       |
| ----------------------------- | --------------------------------- |
| `/admin/cosmos`               | Hub with counts + publish guide   |
| `/admin/cosmos/apps`          | App list                          |
| `/admin/cosmos/apps/new`      | Create app                        |
| `/admin/cosmos/apps/[id]`     | Edit app + nested releases panel  |
| `/admin/cosmos/releases`      | Release list (all apps)           |
| `/admin/cosmos/releases/new`  | Add release (paste GitHub URL)    |
| `/admin/cosmos/releases/[id]` | Edit / delete release             |
| `/admin/cosmos/downloads`     | Download analytics                |

## Library (`src/lib/cosmos/`)

- `urls.ts` — allow-list + protocol validation, extension match, HEAD probe
- `analytics.ts` — IP hashing + fire-and-forget event logging
- `format.ts` — file-size, platform/channel/arch labels, badge classes

## Repository (`src/lib/repositories/cosmos.repo.ts`)

- `listPublishedApps()`, `listFeaturedApps()` — cached store reads
- `getPublishedAppBySlug()` — cached detail read
- `resolveDownloadTarget(slug, platform?)` — **uncached** resolver lookup

Cache tag: `CACHE_TAGS.cosmos`. All admin mutations call
`revalidateTag("cosmos")` so the public store updates without a redeploy.
