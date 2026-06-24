import { NextResponse, type NextRequest } from "next/server";
import { resolveDownloadTarget } from "@/lib/repositories/cosmos.repo";
import { validateDownloadUrl } from "@/lib/cosmos/urls";
import {
  logDownloadEvent,
  clientIpFromHeaders,
} from "@/lib/cosmos/analytics";
import { PLATFORMS } from "@/lib/db/schema/cosmos";

/**
 * Platform-specific branded resolver — /download/[slug]/[platform]
 *
 * Identical safety model to /download/[slug] but restricts the release lookup
 * to a single platform (windows | linux | android | macos | web | iso | other).
 * Still a redirect-only resolver: GitHub carries the bytes, never Vercel.
 */

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}[a-z0-9]$/;
const VALID_PLATFORMS = new Set<string>(PLATFORMS);

function failRedirect(req: NextRequest, slug: string, reason: string): NextResponse {
  const url = new URL(`/cosmos/${SLUG_RE.test(slug) ? slug : ""}`, req.nextUrl.origin);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url, 302);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string; platform: string }> },
): Promise<NextResponse> {
  const { slug: rawSlug, platform: rawPlatform } = await ctx.params;
  const slug = (rawSlug ?? "").toLowerCase();
  const platform = (rawPlatform ?? "").toLowerCase();

  if (!SLUG_RE.test(slug)) return failRedirect(req, slug, "invalid-app");
  if (!VALID_PLATFORMS.has(platform)) return failRedirect(req, slug, "invalid-platform");

  const target = await resolveDownloadTarget(slug, platform);
  if (!target) return failRedirect(req, slug, "not-found");

  const check = validateDownloadUrl(target.release.githubReleaseUrl);
  if (!check.ok || !check.url) return failRedirect(req, slug, "unsafe-url");

  void logDownloadEvent({
    appProductId: target.app.id,
    releaseId: target.release.id,
    slug,
    platform: target.release.platform,
    version: target.release.version,
    userAgent: req.headers.get("user-agent"),
    ip: clientIpFromHeaders(req.headers),
    referrer: req.headers.get("referer"),
  });

  return NextResponse.redirect(check.url, 302);
}
