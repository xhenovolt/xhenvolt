"use client";

import { useEffect, useState } from "react";
import { Cookie, Shield, BarChart3, SlidersHorizontal, Megaphone, X } from "lucide-react";
import {
  getConsent,
  setConsent,
  getVisitorId,
  CONSENT_VERSION,
  type Consent,
} from "@/lib/analytics/consent-client";

/**
 * Premium cookie consent — dark graphite glass banner + preferences modal.
 * Shows for first-time visitors (no stored consent or outdated version).
 * Other components can reopen preferences via:
 *   window.dispatchEvent(new Event("xv-open-cookie-prefs"))
 */

type Cats = { analytics: boolean; marketing: boolean; preferences: boolean };

function postConsent(c: Consent) {
  try {
    const payload = JSON.stringify({
      visitorId: getVisitorId(),
      analytics: c.analytics,
      marketing: c.marketing,
      preferences: c.preferences,
      consentVersion: c.version,
    });
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics/consent", new Blob([payload], { type: "application/json" }));
    } else {
      void fetch("/api/analytics/consent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
        keepalive: true,
      });
    }
  } catch {
    /* ignore */
  }
}

export function CookieConsent() {
  const [open, setOpen] = useState(false); // banner
  const [prefsOpen, setPrefsOpen] = useState(false); // modal
  const [cats, setCats] = useState<Cats>({ analytics: false, marketing: false, preferences: false });

  useEffect(() => {
    const existing = getConsent();
    if (!existing || existing.version !== CONSENT_VERSION) {
      setOpen(true);
    } else {
      setCats({
        analytics: existing.analytics,
        marketing: existing.marketing,
        preferences: existing.preferences,
      });
    }
    const reopen = () => {
      const cur = getConsent();
      if (cur) setCats({ analytics: cur.analytics, marketing: cur.marketing, preferences: cur.preferences });
      setPrefsOpen(true);
      setOpen(true);
    };
    window.addEventListener("xv-open-cookie-prefs", reopen);
    return () => window.removeEventListener("xv-open-cookie-prefs", reopen);
  }, []);

  const commit = (next: Cats) => {
    const saved = setConsent(next);
    postConsent(saved);
    setOpen(false);
    setPrefsOpen(false);
  };

  const acceptAll = () => commit({ analytics: true, marketing: true, preferences: true });
  const rejectNonEssential = () => commit({ analytics: false, marketing: false, preferences: false });
  const savePrefs = () => commit(cats);

  if (!open) return null;

  return (
    <>
      {/* Banner */}
      {!prefsOpen && (
        <div className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-6">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
            <div
              className="h-px w-full"
              style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.7), transparent)" }}
            />
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:p-6">
              <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border border-white/10 bg-zinc-950">
                <Cookie className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-sm font-semibold text-zinc-50">We value your privacy</h2>
                <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                  We use first-party cookies to keep the site working and, with your consent,
                  to understand traffic so we can improve. No selling of data, ever.
                </p>
              </div>
              <div className="flex flex-shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                <button
                  onClick={rejectNonEssential}
                  className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5"
                >
                  Reject non-essential
                </button>
                <button
                  onClick={() => setPrefsOpen(true)}
                  className="cursor-pointer rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:bg-white/5"
                >
                  Customize
                </button>
                <button
                  onClick={acceptAll}
                  className="cursor-pointer rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
                >
                  Accept all
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preferences modal */}
      {prefsOpen && (
        <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-zinc-50">
                <SlidersHorizontal className="h-4 w-4 text-indigo-400" />
                Cookie preferences
              </h2>
              <button
                onClick={() => (getConsent() ? setOpen(false) : setPrefsOpen(false))}
                className="cursor-pointer text-zinc-500 hover:text-zinc-200"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 p-5">
              <CategoryRow
                icon={Shield}
                title="Necessary"
                desc="Required for the site to function (security, sessions). Always on."
                checked
                disabled
              />
              <CategoryRow
                icon={BarChart3}
                title="Analytics"
                desc="First-party traffic measurement so we can improve the site. Anonymized."
                checked={cats.analytics}
                onChange={(v) => setCats((c) => ({ ...c, analytics: v }))}
              />
              <CategoryRow
                icon={SlidersHorizontal}
                title="Preferences"
                desc="Remember choices like theme and layout for a better experience."
                checked={cats.preferences}
                onChange={(v) => setCats((c) => ({ ...c, preferences: v }))}
              />
              <CategoryRow
                icon={Megaphone}
                title="Marketing"
                desc="Measure the effectiveness of campaigns. No third-party ad selling."
                checked={cats.marketing}
                onChange={(v) => setCats((c) => ({ ...c, marketing: v }))}
              />
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4">
              <button
                onClick={rejectNonEssential}
                className="cursor-pointer text-sm font-medium text-zinc-400 hover:text-zinc-200"
              >
                Reject all
              </button>
              <button
                onClick={savePrefs}
                className="cursor-pointer rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
              >
                Save preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function CategoryRow({
  icon: Icon,
  title,
  desc,
  checked,
  disabled,
  onChange,
}: {
  icon: typeof Shield;
  title: string;
  desc: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-zinc-950/50 p-3.5">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-zinc-900">
        <Icon className="h-4 w-4 text-indigo-400" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium text-zinc-100">{title}</div>
        <div className="mt-0.5 text-xs leading-relaxed text-zinc-500">{desc}</div>
      </div>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative mt-0.5 h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
          checked ? "bg-indigo-600" : "bg-zinc-700"
        } ${disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        aria-pressed={checked}
        aria-label={title}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
            checked ? "translate-x-[22px]" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}
