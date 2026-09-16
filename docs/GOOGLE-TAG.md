# Google Tag conversion tracking (landing pages only)

Google Ads conversion tracking (`gtag.js`, tag `AW-18242486527`) is scoped to
`/lp/*` only — it is never loaded from the root layout, matching the existing
landing-page isolation pattern (`app/lp/layout.tsx` already strips the global
Navbar/Footer for these routes).

## Where it lives

- **Env vars** — `.env.local` / `.env.example`:
  - `NEXT_PUBLIC_GOOGLE_TAG_ID` — the `AW-XXXXXXXXX` tag id.
  - `NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL` — the label from a specific Google
    Ads conversion action's `send_to` value (Ads → Goals → Summary →
    conversion action → "Tag setup" → the part after the `/`). Currently set
    to `OVh5CInYkfkcEP-B2fpD` ("Submit lead form conversion"). To add a
    second conversion action later, don't overwrite this — pass its
    `"AW-18242486527/<new-label>"` as `trackConversion`'s second argument
    (`sendTo`) from wherever that action fires; the default stays the lead
    form label for every existing call site.
- **`app/lp/components/GoogleTag.tsx`** — loads the base `gtag.js` snippet via
  `next/script` (`strategy="afterInteractive"`). Mounted once, in
  `app/lp/layout.tsx`, so every current and future page under `/lp/*` gets it
  automatically.
- **`app/lib/analytics/trackConversion.ts`** — `trackConversion(destinationUrl?)`
  fires `gtag('event', 'conversion', ...)` with the `event_callback` +
  `event_timeout: 500` fallback pattern Google recommends, then navigates to
  `destinationUrl` (if given) from whichever fires first — so a slow or
  blocked tag never traps the user on the page.
- **`app/lp/components/TrackedLink.tsx`** — drop-in replacement for `<a>` on
  any `/lp/*` CTA (`tel:`, `mailto:`, external, or internal). Calls
  `trackConversion()` on click and then continues navigation itself (it always
  calls `preventDefault()`).
- **`app/lp/components/LPEstimateForm.tsx`** — the shared estimate form used by
  every area and service landing page. POSTs to `/api/estimate` (Resend) and,
  only once that request confirms success (`res.ok && data.success`), calls
  `trackConversion()` (no destination — the success state is same-page). This
  is also where the "Additional Details" textarea lives, and where any future
  `/lp/*` page should reuse the form from instead of re-implementing one.

## Swapping in a different conversion label later

Set `NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL` in `.env.local` (and on Vercel) —
`trackConversion.ts` will start sending `AW-18242486527/<label>` instead of
the bare tag id. No code change needed.

## Verifying it's firing

1. `npm run dev`, open any `/lp/[area]` page in Chrome, open DevTools →
   Network, and filter for `google.com/pagead` or
   `googleads.g.doubleclick.net` (the Ads conversion pixel — not
   `google-analytics.com`, which is GA4, a separate tag).
2. Click a phone number, or submit the estimate form with valid data.
3. You should see a request fire before the tab navigates (for `tel:` /
   `mailto:` / external links) or right after the estimate API call succeeds
   (for the form) — the 500ms timeout fallback means navigation/success never
   waits long even if that request is slow or blocked by an ad blocker.
