/**
 * Cosmos seed — creates a sample app + release so the store renders with
 * real data on first run. Idempotent: keyed on slug, safe to re-run.
 *
 *   npx tsx scripts/seed-cosmos.ts
 *
 * NOTE: the release URL below is a placeholder pointing at a real GitHub
 * release host so it passes the allow-list. Replace it from /admin/cosmos
 * with your actual DRAIS Desktop asset URL before going live.
 */
import { randomUUID } from "node:crypto";
import { getPool, endPool } from "./_tidb";

const pool = getPool();

async function upsertApp(app: {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription: string;
  category: string;
  icon: string;
  brandColor: string;
  featured: boolean;
  sortOrder: number;
}): Promise<string> {
  const [rows] = (await pool.query(
    "SELECT id FROM app_products WHERE slug = ? LIMIT 1",
    [app.slug],
  )) as [Array<{ id: string }>, unknown];
  if (rows.length > 0) {
    await pool.query(
      `UPDATE app_products SET name=?, tagline=?, description=?, long_description=?,
       category=?, icon=?, brand_color=?, status='published', featured=?, sort_order=?
       WHERE id=?`,
      [
        app.name, app.tagline, app.description, app.longDescription,
        app.category, app.icon, app.brandColor, app.featured, app.sortOrder, rows[0].id,
      ],
    );
    return rows[0].id;
  }
  const id = randomUUID();
  await pool.query(
    `INSERT INTO app_products
     (id, slug, name, tagline, description, long_description, category, icon, brand_color, status, featured, sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,'published',?,?)`,
    [
      id, app.slug, app.name, app.tagline, app.description, app.longDescription,
      app.category, app.icon, app.brandColor, app.featured, app.sortOrder,
    ],
  );
  return id;
}

async function upsertRelease(rel: {
  appProductId: string;
  version: string;
  platform: string;
  architecture: string;
  fileType: string;
  fileSize: number;
  channel: string;
  url: string;
  notes: string;
}): Promise<void> {
  const [rows] = (await pool.query(
    "SELECT id FROM app_releases WHERE app_product_id=? AND version=? AND platform=? LIMIT 1",
    [rel.appProductId, rel.version, rel.platform],
  )) as [Array<{ id: string }>, unknown];
  if (rows.length > 0) {
    await pool.query(
      `UPDATE app_releases SET github_release_url=?, file_size=?, release_notes=?,
       release_channel=?, file_type=?, architecture=?, is_latest=1, status='published',
       published_at=NOW(3) WHERE id=?`,
      [rel.url, rel.fileSize, rel.notes, rel.channel, rel.fileType, rel.architecture, rows[0].id],
    );
    return;
  }
  // Clear sibling latest for this app+platform+channel before inserting.
  await pool.query(
    "UPDATE app_releases SET is_latest=0 WHERE app_product_id=? AND platform=? AND release_channel=?",
    [rel.appProductId, rel.platform, rel.channel],
  );
  await pool.query(
    `INSERT INTO app_releases
     (id, app_product_id, version, release_channel, platform, architecture, file_type,
      file_size, github_release_url, release_notes, is_latest, status, published_at)
     VALUES (?,?,?,?,?,?,?,?,?,?,1,'published',NOW(3))`,
    [
      randomUUID(), rel.appProductId, rel.version, rel.channel, rel.platform,
      rel.architecture, rel.fileType, rel.fileSize, rel.url, rel.notes,
    ],
  );
}

async function main() {
  const draisId = await upsertApp({
    slug: "drais-desktop",
    name: "DRAIS Desktop",
    tagline: "The offline-capable desktop companion for DRAIS school management.",
    description:
      "DRAIS Desktop brings biometric attendance capture, offline sync and fast reporting to school front offices on Windows and Linux.",
    longDescription:
      "DRAIS Desktop is the native companion to the DRAIS school operating system. It connects to fingerprint and face-recognition devices, captures attendance even when the internet is down, and syncs automatically when connectivity returns.\n\nBuilt for Ugandan schools by Xhenvolt, it runs on Windows and Linux and keeps your front office moving regardless of network conditions.",
    category: "Desktop App",
    icon: "monitor",
    brandColor: "#2563EB",
    featured: true,
    sortOrder: 0,
  });

  await upsertRelease({
    appProductId: draisId,
    version: "1.0.0",
    platform: "windows",
    architecture: "x64",
    fileType: "exe",
    fileSize: 74_510_336,
    channel: "stable",
    // Placeholder — replace with your real GitHub release asset URL in /admin/cosmos.
    url: "https://github.com/xhenvoltug/drais-desktop/releases/download/v1.0.0/DRAIS-Desktop-Setup-1.0.0.exe",
    notes: "• First public Cosmos release\n• Biometric device support\n• Offline attendance with auto-sync",
  });

  await upsertRelease({
    appProductId: draisId,
    version: "1.0.0",
    platform: "linux",
    architecture: "x64",
    fileType: "deb",
    fileSize: 68_157_440,
    channel: "stable",
    url: "https://github.com/xhenvoltug/drais-desktop/releases/download/v1.0.0/drais-desktop_1.0.0_amd64.deb",
    notes: "• First public Cosmos release\n• Debian/Ubuntu package",
  });

  console.log("[seed-cosmos] done. DRAIS Desktop app + 2 releases upserted.");
}

main()
  .then(() => endPool())
  .catch(async (err) => {
    console.error("[seed-cosmos] failed:", err.message ?? err);
    await endPool();
    process.exit(1);
  });
