import Script from "next/script";

// Loads gtag.js scoped to /lp/* only (mounted from app/lp/layout.tsx) —
// never in the root layout, so it doesn't load site-wide.
// See docs/GOOGLE-TAG.md for setup and verification.
export default function GoogleTag() {
  const tagId = process.env.NEXT_PUBLIC_GOOGLE_TAG_ID;
  if (!tagId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${tagId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${tagId}');
        `}
      </Script>
    </>
  );
}
