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

## Gating rule
Human page views / events are only sent when **analytics consent is granted**.
Before a choice is made, nothing is tracked client-side. Bot hits are logged
server-side regardless (no cookies, no personal data — legitimate interest).

## Reopening preferences
Any element can reopen the modal:
```js
window.dispatchEvent(new Event("xv-open-cookie-prefs"));
```
(Wire this to a "Cookie settings" link in the footer when desired.)

## Consent versioning
`CONSENT_VERSION` lives in `consent-client.ts` and `/api/analytics/consent`.
Increment it after any material change to categories to re-prompt all visitors.
