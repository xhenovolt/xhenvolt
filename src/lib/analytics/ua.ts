/**
 * Tiny, dependency-free User-Agent parser. Good-enough heuristics for
 * device/browser/OS bucketing — not a full UA database. Kept deliberately
 * small so it adds no bundle weight and runs cheaply server-side.
 */

export interface ParsedUa {
  deviceType: "mobile" | "tablet" | "desktop";
  browser: string;
  os: string;
}

export function parseUserAgent(ua: string | null | undefined): ParsedUa {
  const s = ua ?? "";

  // Device
  let deviceType: ParsedUa["deviceType"] = "desktop";
  if (/\b(iPad|Tablet)\b/i.test(s) || (/Android/i.test(s) && !/Mobile/i.test(s))) {
    deviceType = "tablet";
  } else if (/Mobi|iPhone|Android.*Mobile|Windows Phone|iPod/i.test(s)) {
    deviceType = "mobile";
  }

  // Browser (order matters — Edge/Brave/Samsung before Chrome)
  let browser = "Other";
  if (/Edg(e|A|iOS)?\//i.test(s)) browser = "Edge";
  else if (/OPR\/|Opera/i.test(s)) browser = "Opera";
  else if (/SamsungBrowser/i.test(s)) browser = "Samsung Internet";
  else if (/Firefox\/|FxiOS/i.test(s)) browser = "Firefox";
  else if (/CriOS\//i.test(s)) browser = "Chrome";
  else if (/Chrome\//i.test(s)) browser = "Chrome";
  else if (/Safari\//i.test(s) && /Version\//i.test(s)) browser = "Safari";

  // OS
  let os = "Other";
  if (/Windows NT/i.test(s)) os = "Windows";
  else if (/iPhone|iPad|iPod|iOS/i.test(s)) os = "iOS";
  else if (/Mac OS X|Macintosh/i.test(s)) os = "macOS";
  else if (/Android/i.test(s)) os = "Android";
  else if (/CrOS/i.test(s)) os = "ChromeOS";
  else if (/Linux/i.test(s)) os = "Linux";

  return { deviceType, browser, os };
}

/**
 * Derive source/medium from a referrer URL relative to our own host.
 * Lightweight UTM-free attribution; UTM params (if present) take precedence
 * and are read separately by the API.
 */
export function deriveSource(
  referrer: string | null | undefined,
  selfHost = "xhenvolt.com",
): { source: string | null; medium: string | null } {
  if (!referrer) return { source: "direct", medium: "none" };
  let host: string;
  try {
    host = new URL(referrer).hostname.toLowerCase();
  } catch {
    return { source: null, medium: null };
  }
  if (host.endsWith(selfHost)) return { source: "internal", medium: "internal" };

  const searchEngines = /google\.|bing\.|duckduckgo\.|yahoo\.|yandex\.|baidu\./;
  const social = /facebook\.|fb\.|instagram\.|linkedin\.|t\.co|twitter\.|x\.com|whatsapp|wa\.me|t\.me|telegram|reddit\.|pinterest\./;

  if (searchEngines.test(host)) return { source: host.replace(/^www\./, ""), medium: "organic" };
  if (social.test(host)) return { source: host.replace(/^www\./, ""), medium: "social" };
  return { source: host.replace(/^www\./, ""), medium: "referral" };
}
