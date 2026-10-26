# Cookie consent

Nothing outside the essential category loads until the visitor allows it. The consent state lives in one module. The scripts, embeds and banner all read from it.

## Files

| File | Role |
| --- | --- |
| `lib/cookieCatalog.ts` | `SITE_SERVICES`: every third party, its consent category, its cookies and its storage prefixes. The single source of truth. |
| `lib/consent.ts` | State, storage, expiry, versioning, withdrawal clean-up, `openCookieSettings()`, `useConsent()` and `useConsentFor()`. |
| `components/Tracking.tsx` | `SCRIPTS`: every tracking script, tagged with a category. Renders only the allowed ones. Wires Google Consent Mode v2. |
| `components/legal/CookieBanner.tsx` | The banner and the settings dialog. |
| `components/legal/ConsentGate.tsx` | Wraps an embed (React). Shows a placeholder until its category is allowed. |
| `components/legal/ConsentHtml.tsx` | The same for CMS HTML. Every `<iframe>` in WordPress content waits for external media consent. |
| `components/legal/CookieSettingsButton.tsx` | Reopens the settings from a server component. |

## Categories

| Id | Shown as | Default | Contains |
| --- | --- | --- | --- |
| `essential` | Essential | Always on | reCAPTCHA, the consent record, the cookie scan log |
| `analytics` | Analytics | Off | Google Analytics 4 (`G-DSY99F6FMK`), Snitcher |
| `marketing` | Marketing | Off | HubSpot tracking |
| `media` | External media | Off | YouTube, HubSpot meetings calendar, iframes in blog and job posts |

## Storage

The choice is stored in `localStorage` under `noah-consent` as `{ version, timestamp, choices }`. The banner shows again when:

- the stored choice is older than 12 months,
- `CONSENT_VERSION` changes. It is a hash of each service's `id`, `consent` and `cookieNames` in `SITE_SERVICES`, so editing that list asks everyone again. Bump `SCHEMA` in `lib/consent.ts` to force it by hand,
- there is no stored choice or it cannot be read.

Withdrawing a category deletes its first-party cookies and storage keys (matched by `cookieNames` and `storagePrefixes`) and reloads the page. Every page load also deletes leftovers of the categories that are not allowed.

## Add a tracking script

1. Add the vendor to `SITE_SERVICES` in `lib/cookieCatalog.ts`, with `consent`, `hosts`, `cookieNames` and, if it uses localStorage, `storagePrefixes`. Add its cookies to `COOKIE_CATALOG` so the policy page can describe them.
2. Add an entry to `SCRIPTS` in `components/Tracking.tsx` with the same category. Use `src` for an external file or `inline` for a snippet.
3. Load the site in a clean window. Confirm the script does not load before consent, loads after, and its cookies disappear after withdrawal. If any are left, add their prefix to `storagePrefixes`.

Never add a `<Script>` for a tracker anywhere else.

## Add an embed

Wrap it:

```tsx
<ConsentGate category="media" description="This map is hosted by Google." action="Load map">
  <iframe src="…" />
</ConsentGate>
```

Add the provider to `SITE_SERVICES` as in step 1 above.

## Add a category

1. Add the id to `ConsentGroup` in `lib/cookieCatalog.ts`.
2. Add it to `CONSENT_CATEGORIES`, `NO_CONSENT` and `ALL_CONSENT` in `lib/consent.ts`.
3. Add a row to `CATEGORIES` in `components/legal/CookieBanner.tsx`.
4. Describe it in section 7 of `app/cookies/page.tsx`.

## Reopen the settings

- From React: `openCookieSettings()` from `lib/consent`.
- From a server component: `<CookieSettingsButton />`.
- From anything else: `window.noahCookieSettings()`.
