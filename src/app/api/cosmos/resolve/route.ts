import { NextResponse, type NextRequest } from "next/server";
import {
  getPublishedAppBySlug,
  resolveDownloadTarget,
} from "@/lib/repositories/cosmos.repo";
import { validateDownloadUrl } from "@/lib/cosmos/urls";

/**
 * Metadata-only resolver — /api/cosmos/resolve?slug=&platform=
 *
 * Returns JSON describing the app and its resolvable release. It DELIBERATELY
 * does not return or proxy binary content. Useful for desktop auto-updaters
 * or client-side "check for updates" without scraping the store page.
 *
 * The `downloadUrl` field is the branded resolver path (/download/[slug]),
 * never the raw GitHub URL — clients should hit the resolver so analytics and
 * re-validation run.
 */

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}[a-z0-9]$/;

export async function GET(req: NextRequest): Promise<NextResponse> {
  const slug = (req.nextUrl.searchParams.get("slug") ?? "").toLowerCase();
  const platform = req.nextUrl.searchParams.get("platform")?.toLowerCase() || undefined;

  if (!SLUG_RE.test(slug)) {
    return NextResponse.json({ error: "invalid_slug" }, { status: 400 });
  }

  const app = await getPublishedAppBySlug(slug);
  if (!app) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const target = await resolveDownloadTarget(slug, platform);
  const release = target?.release ?? null;
  const safe = release ? validateDownloadUrl(release.githubReleaseUrl).ok : false;

  return NextResponse.json(
    {
      app: {
        slug: app.slug,
        name: app.name,
        tagline: app.tagline,
        category: app.category,
        platforms: app.platforms,
      },
      latest: release && safe
        ? {
            version: release.version,
            platform: release.platform,
            architecture: release.architecture,
            channel: release.releaseChannel,
            fileType: release.fileType,
            fileSize: release.fileSize,
            checksumSha256: release.checksumSha256,
            publishedAt: release.publishedAt,
            // Branded resolver, NOT the raw asset URL.
            downloadUrl: platform
              ? `/download/${slug}/${release.platform}`
              : `/download/${slug}`,
          }
        : null,
    },
    {
      status: 200,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    },
  );
}
