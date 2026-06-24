# Download Routing — Why Redirects, Not Proxying

## The bandwidth problem

This site runs on **Vercel Hobby**. If a download was served *through* Vercel
(streamed via a route handler, middleware, or server function), every byte of
every download would count against Vercel's bandwidth limits. A handful of
users pulling a 70 MB installer could exhaust the allowance and take the whole
website down.

## The rule

> **Cosmos never fetches, streams, buffers, or proxies a binary.**
> It validates, logs, and **redirects** to GitHub, which carries the bytes.

This is enforced in code:

- `/download/[slug]` and `/download/[slug]/[platform]` are **route handlers**
  that end in `NextResponse.redirect(url, 302)`. They never call `fetch()` on
  the asset.
- `middleware.ts` matches **only `/admin`** — it never touches `/download`,
  never does DB lookups for downloads, never proxies binaries.
- The HEAD reachability probe (`probeReleaseUrl`) exists **only** in the
  admin "Verify URL" path. The public download path does not probe.

## Resolver flow (`/download/[slug]`)

```
GET /download/drais-desktop
  │
  ├─ 1. validate slug             (regex; bad → 302 /cosmos?error=invalid-app)
  ├─ 2. resolveDownloadTarget()   (latest published release; none → ?error=not-found)
  ├─ 3. validateDownloadUrl()     (allow-list + https; bad → ?error=unsafe-url)
  ├─ 4. logDownloadEvent()        (fire-and-forget; never blocks)
  └─ 5. NextResponse.redirect(githubReleaseUrl, 302)   ← GitHub serves the file
```

The platform variant (`/download/[slug]/[platform]`) is identical but filters
the release lookup to one platform.

## Why 302 (not 301)

A 302 (temporary) lets us change the target asset URL for the same branded link
whenever a new version ships — the branded URL stays stable, the destination
moves. 307 would also work; we use 302 for the broadest client/CDN compatibility.

## "Latest" selection

`resolveDownloadTarget` ranks candidate releases:

1. `is_latest = true` wins
2. then channel rank: stable > beta > alpha > legacy
3. then most recent `published_at` / `created_at`

## What this buys us

- Vercel serves **only** small HTML/JSON + a redirect header per download.
- GitHub's CDN serves the actual file at its own (free, fast) bandwidth.
- We still get full **download-intent analytics** because the click passes
  through our resolver first.
