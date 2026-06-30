# Cookie Consent

A premium dark-glass consent banner + preferences modal, shown to first-time
visitors. Component: `src/components/analytics/CookieConsent.tsx`; client state:
`src/lib/analytics/consent-client.ts`.

## Categories
1. **Necessary** — always on (security, sessions). Not an opt-in.
2. **Analytics** — first-party traffic measurement. Gates all human page-view
   and event tracking.
3. **Preferences** — remembering choices (theme/layout).
4. **Marketing** — campaign effectiveness. No third-party ad selling.

## Banner behavior
- Shows when there is no stored consent, or the stored `version` differs from the
  current `CONSENT_VERSION` (bump the version to re-prompt everyone).
- Buttons: **Accept all**, **Reject non-essential**, **Customize** (opens modal).
- Modal: per-category toggles + **Save preferences** / **Reject all**.

## Storage
- **Browser:** `localStorage["xv_consent"]` (+ a mirror cookie `xv_consent`,
  180-day, SameSite=Lax, non-httpOnly because it's non-sensitive state).
- **Identity:** `xv_vid` (persistent visitorId, localStorage), `xv_sid`
  (per-tab sessionId, sessionStorage). Minted only after a consent choice.
- **Server:** a `cookie_consents` audit row per visitor (latest wins) via
  `POST /api/analytics/consent`, so the CMS can show acceptance rates.

## Gating rule (cookieless-first)
- **Page views are counted anonymously without consent** — no cookie, no
  persistent id (path/referrer/device/country only). This gives the owner
  complete traffic numbers without identifying anyone.
- **Analytics consent adds identity + events**: persistent `visitorId`/`sessionId`
  (unique visitors, journeys) and CTA/event tracking.
- Bot hits are logged server-side regardless (no cookies, no personal data).

This mirrors privacy-first analytics (Plausible/Fathom): anonymous aggregate
counting needs no consent; cross-visit identification does.

## Reopening preferences
Any element can reopen the modal:
```js
window.dispatchEvent(new Event("xv-open-cookie-prefs"));
```
(Wire this to a "Cookie settings" link in the footer when desired.)

## Consent versioning
`CONSENT_VERSION` lives in `consent-client.ts` and `/api/analytics/consent`.
Increment it after any material change to categories to re-prompt all visitors.
