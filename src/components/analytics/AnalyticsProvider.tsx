"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";
import { usePathname } from "next/navigation";
import {
  hasAnalyticsConsent,
  getVisitorId,
  getSessionId,
  CONSENT_EVENT,
} from "@/lib/analytics/consent-client";

/**
 * Centralized first-party tracker. One place owns all tracking logic:
 *  - page views on route change
 *  - CTA clicks via [data-track] attributes (no scattered onClick handlers)
 *  - outbound links, tel:/mailto: automatically
 *
 * Everything is consent-gated (analytics category) and sent with
 * navigator.sendBeacon so it never blocks navigation or rendering.
 */

interface TrackEventOpts {
  type?: "cta" | "outbound" | "form" | "download" | "nav" | "custom";
  target?: string;
  metadata?: Record<string, unknown>;
}

interface AnalyticsApi {
  trackEvent: (name: string, opts?: TrackEventOpts) => void;
  trackDownload: (opts: { appSlug: string; platform?: string; version?: string }) => void;
}

const AnalyticsContext = createContext<AnalyticsApi | null>(null);

function send(url: string, payload: Record<string, unknown>) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(url, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* never throw from tracking */
  }
}

function ids() {
  return { visitorId: getVisitorId(), sessionId: getSessionId() };
}

function utm() {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      source: p.get("utm_source") ?? undefined,
      medium: p.get("utm_medium") ?? undefined,
      campaign: p.get("utm_campaign") ?? undefined,
    };
  } catch {
    return {};
  }
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const consentRef = useRef(false);
  const lastPath = useRef<string | null>(null);

  // Page views are counted ANONYMOUSLY for every visit (cookieless — no
  // persistent id, no cross-page identity), so the owner sees complete traffic.
  // A persistent visitorId/sessionId is attached ONLY after analytics consent.
  // Dedupe guard: at most one view per path per transition.
  const logPageView = useCallback(() => {
    if (!pathname) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    send("/api/analytics/pageview", {
      path: pathname,
      title: typeof document !== "undefined" ? document.title : undefined,
      referrer: typeof document !== "undefined" ? document.referrer : undefined,
      ...utm(),
      // Identity only with consent — keeps pre-consent views cookieless.
      ...(consentRef.current ? ids() : {}),
    });
  }, [pathname]);

  // Track current consent state, react to changes from the cookie banner.
  useEffect(() => {
    const refresh = () => {
      consentRef.current = hasAnalyticsConsent();
    };
    refresh();
    window.addEventListener(CONSENT_EVENT, refresh);
    return () => window.removeEventListener(CONSENT_EVENT, refresh);
  }, []);

  // Page view on every route change (anonymous regardless of consent).
  useEffect(() => {
    logPageView();
  }, [pathname, logPageView]);

  const trackEvent = useCallback<AnalyticsApi["trackEvent"]>((name, opts) => {
    if (!consentRef.current) return;
    send("/api/analytics/event", {
      eventType: opts?.type ?? "custom",
      eventName: name,
      path: pathname,
      target: opts?.target,
      metadata: opts?.metadata,
      ...ids(),
    });
  }, [pathname]);

  const trackDownload = useCallback<AnalyticsApi["trackDownload"]>((opts) => {
    if (!consentRef.current) return;
    send("/api/analytics/event", {
      eventType: "download",
      eventName: "cosmos_download",
      path: pathname,
      target: opts.appSlug,
      metadata: { platform: opts.platform, version: opts.version },
      ...ids(),
    });
  }, [pathname]);

  // Global click capture for CTAs / outbound / tel / mailto — no per-button wiring.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!consentRef.current) return;
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-track], a[href]",
      );
      if (!el) return;

      // Explicit CTA marker wins.
      const marked = el.getAttribute("data-track");
      if (marked) {
        trackEvent(marked, {
          type: (el.getAttribute("data-track-type") as TrackEventOpts["type"]) ?? "cta",
          target: el.getAttribute("href") ?? el.getAttribute("data-track-target") ?? undefined,
        });
        return;
      }

      // Auto: outbound links, tel:, mailto:
      if (el.tagName === "A") {
        const href = el.getAttribute("href") ?? "";
        if (href.startsWith("tel:")) {
          trackEvent("call_click", { type: "cta", target: href });
        } else if (href.startsWith("mailto:")) {
          trackEvent("email_click", { type: "cta", target: href });
        } else if (/^https?:\/\//i.test(href) && !href.includes(window.location.host)) {
          trackEvent("outbound_click", { type: "outbound", target: href });
        }
      }
    };
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [trackEvent]);

  return (
    <AnalyticsContext.Provider value={{ trackEvent, trackDownload }}>
      {children}
    </AnalyticsContext.Provider>
  );
}

export function useAnalytics(): AnalyticsApi {
  return (
    useContext(AnalyticsContext) ?? {
      trackEvent: () => {},
      trackDownload: () => {},
    }
  );
}
