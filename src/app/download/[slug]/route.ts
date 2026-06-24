import { NextResponse, type NextRequest } from "next/server";
import { resolveDownloadTarget } from "@/lib/repositories/cosmos.repo";
import { validateDownloadUrl } from "@/lib/cosmos/urls";
import {
  logDownloadEvent,
  clientIpFromHeaders,
} from "@/lib/cosmos/analytics";

/**
 * Branded download resolver — /download/[slug]
 *
 * THIS IS NOT A PROXY. It performs:
 *   1. slug validation
 *   2. lookup of the latest published release
 *   3. allow-listed URL validation (open-redirect protection)
 *   4. best-effort download-intent logging
 *   5. a 302 redirect to the GitHub Release asset
 *
 * GitHub serves every byte. We never fetch, stream, or buffer the binary —
 * that is the whole point: it keeps large downloads off Vercel's bandwidth.
 * See DOWNLOAD_ROUTING.md.
 *
 * Route handlers do not inherit the (website) layout, so this stays a thin,
 * fast redirect with no page chrome.
 */

export const dynamic = "force-dynamic";

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,118}[a-z0-9]$/;

function failRedirect(req: NextRequest, reason: string): NextResponse {
  const url = new URL("/cosmos", req.nextUrl.origin);
  url.searchParams.set("error", reason);
  return NextResponse.redirect(url, 302);
}

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug: rawSlug } = await ctx.params;
  const slug = (rawSlug ?? "").toLowerCase();

  if (!SLUG_RE.test(slug)) {
    return failRedirect(req, "invalid-app");
  }

  const target = await resolveDownloadTarget(slug);
  if (!target) {
    return failRedirect(req, "not-found");
  }

  // Defense in depth: re-validate the stored URL at redirect time so a host
  // that was later removed from the allow-list cannot be served.
  const check = validateDownloadUrl(target.release.githubReleaseUrl);
  if (!check.ok || !check.url) {
    return failRedirect(req, "unsafe-url");
  }

  // Fire-and-forget analytics — must not delay the redirect.
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
