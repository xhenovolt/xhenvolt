import {
  mysqlTable,
  varchar,
  text,
  int,
  bigint,
  boolean,
  timestamp,
  index,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import {
  id,
  createdAt,
  updatedAt,
  deletedAt,
  sortOrder,
} from "./_shared";

/**
 * Xhenvolt Cosmos — software release center data model.
 *
 * Three tables back the public app store, the branded download resolver,
 * and download analytics:
 *
 *   app_products    — one row per downloadable product (DRAIS Desktop, …)
 *   app_releases    — every published build/asset for a product
 *   download_events — anonymized download-intent log (NOT binary transfer)
 *
 * IMPORTANT: binaries are NEVER stored or proxied. `github_release_url`
 * points at a GitHub Release asset; the /download/[slug] resolver only
 * validates + logs + 302-redirects there so GitHub carries the bandwidth,
 * not Vercel. See DOWNLOAD_ROUTING.md.
 *
 * Status model mirrors the rest of the CMS:
 *   draft | published | archived  (only `published` is publicly visible)
 */

export const APP_STATUS = ["draft", "published", "archived"] as const;
export type AppStatus = (typeof APP_STATUS)[number];

export const RELEASE_CHANNELS = ["stable", "beta", "alpha", "legacy"] as const;
export type ReleaseChannel = (typeof RELEASE_CHANNELS)[number];

export const PLATFORMS = [
  "windows",
  "linux",
  "android",
  "macos",
  "web",
  "iso",
  "other",
] as const;
export type Platform = (typeof PLATFORMS)[number];

export const ARCHITECTURES = ["x64", "arm64", "universal", "other"] as const;
export type Architecture = (typeof ARCHITECTURES)[number];

export const FILE_TYPES = [
  "exe",
  "deb",
  "apk",
  "appimage",
  "iso",
  "zip",
  "dmg",
  "other",
] as const;
export type FileType = (typeof FILE_TYPES)[number];

export const appProducts = mysqlTable(
  "app_products",
  {
    id: id(),
    slug: varchar("slug", { length: 120 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    tagline: varchar("tagline", { length: 240 }),
    description: text("description").notNull(),
    longDescription: text("long_description"),
    category: varchar("category", { length: 80 }),
    /** Lucide icon name (e.g. "Monitor") rendered on cards. */
    icon: varchar("icon", { length: 80 }),
    /** Optional raster/SVG logo URL; takes precedence over `icon`. */
    iconUrl: varchar("icon_url", { length: 500 }),
    brandColor: varchar("brand_color", { length: 30 }),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    featured: boolean("featured").notNull().default(false),
    sortOrder: sortOrder(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
    deletedAt: deletedAt(),
  },
  (t) => [
    uniqueIndex("app_products_slug_uq").on(t.slug),
    index("app_products_status_idx").on(t.status),
    index("app_products_category_idx").on(t.category),
  ],
);

export const appReleases = mysqlTable(
  "app_releases",
  {
    id: id(),
    appProductId: varchar("app_product_id", { length: 36 })
      .references(() => appProducts.id, { onDelete: "cascade" })
      .notNull(),
    version: varchar("version", { length: 60 }).notNull(),
    releaseChannel: varchar("release_channel", { length: 20 })
      .notNull()
      .default("stable"),
    platform: varchar("platform", { length: 20 }).notNull(),
    architecture: varchar("architecture", { length: 20 })
      .notNull()
      .default("x64"),
    fileType: varchar("file_type", { length: 20 }).notNull(),
    /** Bytes. ISO/AppImage can exceed 2GB so we use bigint, not int. */
    fileSize: bigint("file_size", { mode: "number" }),
    githubReleaseUrl: varchar("github_release_url", { length: 700 }).notNull(),
    checksumSha256: varchar("checksum_sha256", { length: 128 }),
    releaseNotes: text("release_notes"),
    /** Marks the current download for an (app, platform, channel) tuple. */
    isLatest: boolean("is_latest").notNull().default(false),
    /** draft | published | archived — only published is resolvable publicly. */
    status: varchar("status", { length: 20 }).notNull().default("published"),
    publishedAt: timestamp("published_at", { fsp: 3 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("app_releases_product_idx").on(t.appProductId),
    index("app_releases_platform_idx").on(t.platform),
    index("app_releases_latest_idx").on(t.appProductId, t.isLatest),
    index("app_releases_status_idx").on(t.status),
  ],
);

export const downloadEvents = mysqlTable(
  "download_events",
  {
    id: id(),
    appProductId: varchar("app_product_id", { length: 36 }),
    releaseId: varchar("release_id", { length: 36 }),
    slug: varchar("slug", { length: 120 }).notNull(),
    platform: varchar("platform", { length: 20 }),
    version: varchar("version", { length: 60 }),
    userAgent: varchar("user_agent", { length: 500 }),
    /** SHA-256 of (ip + daily salt). Never the raw IP. */
    ipHash: varchar("ip_hash", { length: 64 }),
    referrer: varchar("referrer", { length: 500 }),
    createdAt: createdAt(),
  },
  (t) => [
    index("download_events_product_idx").on(t.appProductId),
    index("download_events_slug_idx").on(t.slug),
    index("download_events_created_idx").on(t.createdAt),
    index("download_events_platform_idx").on(t.platform),
  ],
);
