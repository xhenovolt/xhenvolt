# Cosmos — Future Roadmap

Cosmos was built to grow. The current release ships the store, the branded
resolver, the CMS, and analytics. Natural next steps:

## 1. Auto GitHub API integration
- Given an `owner/repo`, pull the latest release + assets via the GitHub API and
  pre-fill version, file size, and asset URLs — no manual paste.
- Optional webhook so a new GitHub release auto-creates a draft `app_release`.
- A scheduled job to detect new tags and notify the admin.

## 2. Update channels & auto-updater support
- `/api/cosmos/resolve` already returns structured metadata. Extend it into a
  proper update feed (e.g. an Electron `electron-updater` / Squirrel-compatible
  `latest.yml` / `RELEASES` endpoint) so DRAIS Desktop can self-update.
- Per-channel feeds: `?channel=beta` opt-in.

## 3. Checksums & signed releases
- `checksum_sha256` is already stored and shown. Next: auto-fetch a published
  `.sha256` sidecar asset during URL verification and compare.
- Add `signature` / `.sig` support and surface a "Verified signature" badge.

## 4. Platform-specific smart download
- Detect the visitor's OS (UA hints) and default the primary CTA to the right
  platform build, while still listing all platforms.

## 5. CDN migration path
- Host validation is env-driven (`COSMOS_ALLOWED_DOWNLOAD_HOSTS`), so moving
  some assets to a dedicated CDN/R2/Cloudflare is a config change, not a rewrite.
- Keep the branded `/download/[slug]` resolver stable across host changes.

## 6. Richer store
- Screenshots / changelog feed per app (`app_release_notes` history view).
- Categories & search/filter on `/cosmos`.
- Per-app dynamic OG image generation (`next/og` `ImageResponse`) using the app
  icon + brand color.

## 7. Analytics depth
- Geo (country) from edge headers (no IP storage).
- Conversion funnel: store view → detail view → download.
- Export to the existing admin audit/reporting surface.

## 8. Release governance
- Draft → review → publish workflow for releases (the `status` column already
  supports it).
- Optional approval step before a release becomes `is_latest`.
