"use client";

/**
 * Client-side consent + first-party identity.
 *
 * - Consent is stored in localStorage (and mirrored to a cookie so it can be
 *   read at request time if ever needed). Categories: necessary (always on),
 *   analytics, marketing, preferences.
 * - visitorId is a persistent first-party random id; sessionId is per-tab.
 *   They are only minted once the visitor has made a consent choice, and are
 *   only *sent* with tracking when analytics consent is granted.
 */

export const CONSENT_VERSION = "1";
const CONSENT_KEY = "xv_consent";
const VID_KEY = "xv_vid";
const SID_KEY = "xv_sid";
export const CONSENT_EVENT = "xv-consent-changed";

export interface Consent {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  version: string;
}

export const DEFAULT_CONSENT: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  version: CONSENT_VERSION,
};

export function getConsent(): Consent | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Consent>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
      preferences: Boolean(parsed.preferences),
      version: parsed.version ?? CONSENT_VERSION,
    };
  } catch {
    return null;
  }
}

export function setConsent(c: Omit<Consent, "necessary" | "version">): Consent {
  const full: Consent = { necessary: true, version: CONSENT_VERSION, ...c };
  try {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(full));
    // 180-day cookie mirror (not httpOnly — it's non-sensitive consent state).
    document.cookie = `${CONSENT_KEY}=${encodeURIComponent(
      JSON.stringify(full),
    )}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: full }));
  } catch {
    /* ignore */
  }
  return full;
}

export function hasAnalyticsConsent(): boolean {
  return getConsent()?.analytics === true;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let v = localStorage.getItem(VID_KEY);
  if (!v) {
    v = uuid();
    try {
      localStorage.setItem(VID_KEY, v);
    } catch {
      /* ignore */
    }
  }
  return v;
}

export function getSessionId(): string {
  if (typeof window === "undefined") return "";
  let s = sessionStorage.getItem(SID_KEY);
  if (!s) {
    s = uuid();
    try {
      sessionStorage.setItem(SID_KEY, s);
    } catch {
      /* ignore */
    }
  }
  return s;
}
