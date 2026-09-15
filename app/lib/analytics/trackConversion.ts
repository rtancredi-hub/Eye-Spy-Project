// Fires the Google Ads conversion event for /lp/* CTA clicks and form
// submissions. See docs/GOOGLE-TAG.md for setup and verification.

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const GOOGLE_TAG_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
const CONVERSION_LABEL = process.env.NEXT_PUBLIC_GOOGLE_CONVERSION_LABEL;

// Falls back to the bare tag id when no conversion label has been supplied
// yet — swap in the real label once the client provides one (see .env.example).
const SEND_TO = CONVERSION_LABEL
  ? `${GOOGLE_TAG_ID}/${CONVERSION_LABEL}`
  : GOOGLE_TAG_ID;

// Reports a conversion, then calls back (e.g. to continue navigation).
// Uses gtag's event_callback + event_timeout fallback so a slow or blocked
// tag never traps the user on the page — the callback fires from whichever
// happens first, and only ever runs once.
export function trackConversion(destinationUrl?: string): void {
  const proceed = () => {
    if (destinationUrl) window.location.href = destinationUrl;
  };

  if (typeof window === "undefined" || !GOOGLE_TAG_ID || typeof window.gtag !== "function") {
    proceed();
    return;
  }

  let called = false;
  const callbackOnce = () => {
    if (called) return;
    called = true;
    proceed();
  };

  window.gtag("event", "conversion", {
    send_to: SEND_TO,
    event_callback: callbackOnce,
    event_timeout: 500,
  });

  setTimeout(callbackOnce, 500);
}
