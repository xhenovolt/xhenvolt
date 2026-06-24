/**
 * Cosmos download-URL safety.
 *
 * The single most important security boundary in Cosmos: a release URL is
 * only ever accepted (admin save) or honored (public redirect) if it points
 * at an approved host over HTTPS. This prevents:
 *   - open redirects (…/download/x → attacker.com)
 *   - javascript:/data:/file: protocol injection
 *   - exfiltration via arbitrary external hosts
 *
 * Allowed hosts default to GitHub's release infrastructure and can be
 * extended (future CDN) via COSMOS_ALLOWED_DOWNLOAD_HOSTS (comma-separated).
 */

import type { FileType } from "@/lib/db/schema/cosmos";

/** Exact hostnames that are always allowed. */
const DEFAULT_ALLOWED_HOSTS = [
  "github.com",
  "www.github.com",
  "objects.githubusercontent.com",
  "release-assets.githubusercontent.com",
  "github-releases.githubusercontent.com",
  "codeload.github.com",
];

/** Any host ending in one of these suffixes is allowed (GitHub asset CDNs). */
const ALLOWED_HOST_SUFFIXES = [".githubusercontent.com"];

export function allowedHosts(): string[] {
  const extra = (process.env.COSMOS_ALLOWED_DOWNLOAD_HOSTS ?? "")
    .split(",")
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean);
  return Array.from(new Set([...DEFAULT_ALLOWED_HOSTS, ...extra]));
}

export interface UrlCheck {
  ok: boolean;
  /** Specific, human-readable reason when ok === false. */
  reason?: string;
  /** Normalized URL when ok === true. */
  url?: string;
  host?: string;
}

/**
 * Validate that `raw` is a safe, downloadable release URL.
 * Pure + synchronous — safe to call in server actions and route handlers.
 */
export function validateDownloadUrl(raw: string | null | undefined): UrlCheck {
  if (!raw || raw.trim() === "") {
    return { ok: false, reason: "URL is empty." };
  }
  const value = raw.trim();

  // Reject dangerous protocols before the URL parser can normalize them.
  if (/^\s*(javascript|data|file|vbscript|blob):/i.test(value)) {
    return { ok: false, reason: "Disallowed URL protocol." };
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    return { ok: false, reason: "URL is not well-formed." };
  }

  if (parsed.protocol !== "https:") {
    return { ok: false, reason: "Only HTTPS URLs are allowed." };
  }

  const host = parsed.hostname.toLowerCase();
  const hosts = allowedHosts();
  const exact = hosts.includes(host);
  const suffix = ALLOWED_HOST_SUFFIXES.some((s) => host.endsWith(s));
  if (!exact && !suffix) {
    return {
      ok: false,
      reason: `Host "${host}" is not an approved download host. Allowed: ${hosts.join(", ")} (or *.githubusercontent.com).`,
      host,
    };
  }

  return { ok: true, url: parsed.toString(), host };
}

/** Map a selected fileType to the extension(s) we expect in the URL path. */
const FILE_TYPE_EXTENSIONS: Record<FileType, string[]> = {
  exe: [".exe"],
  deb: [".deb"],
  apk: [".apk"],
  appimage: [".appimage"],
  iso: [".iso"],
  zip: [".zip"],
  dmg: [".dmg"],
  other: [],
};

/**
 * Soft-check that the URL's file extension matches the declared fileType.
 * Returns ok:true for "other" (no constraint) or when the path has no
 * recognizable extension (some asset URLs are query-driven).
 */
export function extensionMatchesFileType(
  rawUrl: string,
  fileType: FileType,
): UrlCheck {
  const expected = FILE_TYPE_EXTENSIONS[fileType] ?? [];
  if (expected.length === 0) return { ok: true };
  let pathname = "";
  try {
    pathname = new URL(rawUrl).pathname.toLowerCase();
  } catch {
    return { ok: false, reason: "URL is not well-formed." };
  }
  const matches = expected.some((ext) => pathname.endsWith(ext));
  if (!matches) {
    return {
      ok: false,
      reason: `URL does not end in ${expected.join(" or ")} (expected for file type "${fileType}").`,
    };
  }
  return { ok: true };
}

/**
 * Best-effort reachability probe via a HEAD request. NEVER downloads the
 * body. Used only by the admin "Verify URL" button — the public redirect
 * path does NOT call this (it must stay fast and never fetch the binary).
 */
export async function probeReleaseUrl(rawUrl: string): Promise<{
  ok: boolean;
  status?: number;
  contentLength?: number | null;
  reason?: string;
}> {
  const check = validateDownloadUrl(rawUrl);
  if (!check.ok || !check.url) return { ok: false, reason: check.reason };
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(check.url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const lenRaw = res.headers.get("content-length");
    return {
      ok: res.ok,
      status: res.status,
      contentLength: lenRaw ? Number(lenRaw) : null,
      reason: res.ok ? undefined : `Server returned HTTP ${res.status}.`,
    };
  } catch (err) {
    return {
      ok: false,
      reason:
        err instanceof Error && err.name === "AbortError"
          ? "Reachability check timed out."
          : "Could not reach the URL (network error).",
    };
  }
}
