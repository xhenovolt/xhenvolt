# Cosmos Security Notes

## Threat model

A download resolver that redirects to a stored URL is, by definition, a
potential **open redirect** and a vector for serving malicious files. Cosmos
mitigates this with a strict allow-list enforced at **both** write time (admin
save) and read time (public redirect).

## URL validation (`src/lib/cosmos/urls.ts`)

`validateDownloadUrl(raw)` rejects a URL unless ALL hold:

1. Non-empty.
2. Protocol is **not** `javascript:`, `data:`, `file:`, `vbscript:`, `blob:`
   (checked before parsing, so normalization can't sneak them through).
3. Parses as a valid `URL`.
4. Protocol is **`https:`** only.
5. Hostname is an **exact match** on the allow-list OR ends with an allowed
   suffix (`.githubusercontent.com`).

### Allowed hosts (default)

```
github.com, www.github.com, objects.githubusercontent.com,
release-assets.githubusercontent.com, github-releases.githubusercontent.com,
codeload.github.com, *.githubusercontent.com
```

Extend via env (no redeploy of logic needed):

```
COSMOS_ALLOWED_DOWNLOAD_HOSTS=cdn.example.com,downloads.example.org
```

## Defense in depth

- **Write time:** the release server actions (`createRelease` / `updateRelease`)
  run `validateDownloadUrl` + `extensionMatchesFileType` and **throw** before
  any unsafe URL is persisted.
- **Read time:** the `/download/*` handlers re-run `validateDownloadUrl` on the
  stored URL *every request*. If a host is later removed from the allow-list,
  previously-saved URLs stop resolving (→ `?error=unsafe-url`).

## Open-redirect prevention

The resolver can only ever `redirect()` to a URL that passed the allow-list.
There is no user-controlled redirect target — the slug maps to a DB row, and the
row's URL must itself be allow-listed. Failure paths redirect to `/cosmos`
(same-origin), never to an attacker-supplied location.

## Auth & access control

- All admin pages live under `admin/(authed)/` which enforces a DB-backed
  session in the layout; `middleware.ts` gates `/admin/*` on cookie presence.
- Every Cosmos **server action** calls `requireAdmin()` first.
- `/api/admin/cosmos/verify` checks `getCurrentAdmin()` and returns 401 otherwise.

## Privacy (analytics)

- The raw client IP is **never stored**. `download_events.ip_hash` is
  `SHA-256(ip | YYYY-MM-DD | salt)` — daily-rotating and non-reversible.
- Set `COSMOS_IP_SALT` in production for a non-default salt.
- User agent and referrer are truncated to 500 chars.

## No binary handling

Cosmos never uploads, stores, fetches, streams, or proxies a binary. The only
network call to an asset URL is an admin-triggered **HEAD** (no body) for the
verifier. See `DOWNLOAD_ROUTING.md`.

## Environment variables

| Var                              | Required | Purpose                              |
| -------------------------------- | -------- | ------------------------------------ |
| `COSMOS_ALLOWED_DOWNLOAD_HOSTS`  | no       | Extra approved hosts (comma-sep)     |
| `COSMOS_IP_SALT`                 | prod rec | Salt for download IP hashing         |
