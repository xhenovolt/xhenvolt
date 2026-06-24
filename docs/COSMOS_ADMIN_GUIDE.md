# Cosmos Admin Guide

All Cosmos management lives under **Admin → Cosmos** (`/admin/cosmos`). You
must be signed in as an admin.

## 1. Add an app

1. Go to **Cosmos → Apps → + New app**.
2. Fill in **Name** (Slug auto-fills — it's used in `/cosmos/[slug]` and
   `/download/[slug]`).
3. Add a **tagline**, **description**, optional **long description**.
4. Pick an **icon name** (lucide: `monitor`, `smartphone`, `cpu`, `package`,
   `database`, `terminal`, …) or paste an **icon image URL**.
5. Set a **brand color** (hex) for the card glow.
6. Set **Status = Published** to make it public. Tick **Featured** to highlight it.
7. Save.

## 2. Add a release (publish a version)

The core workflow:

1. **On GitHub:** create a release and upload your installer asset
   (`.exe`, `.deb`, `.apk`, `.AppImage`, `.iso`, …).
2. **Copy the asset's direct download URL.** It looks like:
   `https://github.com/<org>/<repo>/releases/download/v1.0.0/App-Setup-1.0.0.exe`
3. **In the CMS:** open the app → **Add release** (or **Cosmos → Releases →
   + New release**).
4. Choose the **app**, set **version** (e.g. `1.0.0`, no leading `v`),
   **platform**, **architecture**, **release channel**, and **file type**.
5. **Paste the GitHub URL** into *GitHub release asset URL*.
6. Click **Verify URL** — it checks:
   - host & protocol are on the allow-list,
   - the file extension matches the file type,
   - the asset is reachable (HEAD request) and reports its size.
7. (Optional) paste the **SHA-256 checksum** to enable verification on the
   public page. (Optional) add **release notes**.
8. Tick **Mark as latest** so this build becomes the default download for that
   app + platform + channel. Set **Status = Published**.
9. Save. The public store updates immediately — **no redeploy needed**.

## 3. Update to a newer version

Repeat step 2 with the new version number and the new GitHub URL, ticking
**Mark as latest**. The previous "latest" for that platform/channel is
automatically unset. Old releases remain listed (archive them if you want them
hidden).

## 4. Test a download link

- On the app edit page, click **Test download** (opens `/download/[slug]`).
- On a release edit page, click **Test download route**
  (opens `/download/[slug]/[platform]`).
- Or click **Open release URL** in the verifier to hit the raw GitHub asset.

## 5. Publish / unpublish / archive

- **Apps list** → *Toggle publish* flips an app between published/draft.
- **Apps list** → *Archive* hides it from the public store.
- **Releases list** → *Make latest* / *Archive*. Edit a release to **Delete**.

## 6. Analytics

**Cosmos → Downloads** shows total downloads, last-7-days, top products,
by platform, by version, and recent activity. These are *download clicks*
(intent), not file transfers — GitHub serves the bytes.

## Seeding sample data

`npm run db:seed-cosmos` upserts a sample **DRAIS Desktop** app with two
releases. Replace the placeholder GitHub URLs with real assets from the admin.
