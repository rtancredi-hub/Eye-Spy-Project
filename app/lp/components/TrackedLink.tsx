"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { trackConversion } from "../../lib/analytics/trackConversion";

// Wraps a CTA link on /lp/* pages — fires a Google Ads conversion event on
// click, then continues navigation via trackConversion's callback/timeout
// fallback so a slow or blocked tag never traps the user. Handles internal
// hrefs, tel:, mailto:, and external URLs. See docs/GOOGLE-TAG.md.
export default function TrackedLink({
  href,
  children,
  className,
  style,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const router = useRouter();
  const isExternalish = /^(tel:|mailto:|https?:)/.test(href);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (isExternalish) {
      trackConversion(href);
    } else {
      trackConversion();
      router.push(href);
    }
  };

  return (
    <a href={href} onClick={handleClick} className={className} style={style}>
      {children}
    </a>
  );
}
