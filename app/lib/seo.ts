import type { Metadata } from "next";
import { urlFor } from "./sanity";

// Builds a consistent Metadata object (canonical URL + OG/Twitter image)
// so every page follows the same SEO shape without repeating boilerplate.
export function buildMetadata({
  title,
  description,
  path,
  siteUrl,
  siteName,
  ogImage,
  canonical,
  noindex,
}: {
  title: string;
  description?: string;
  path: string;
  siteUrl: string;
  siteName: string;
  ogImage?: any;
  canonical?: string;
  noindex?: boolean;
}): Metadata {
  const url = `${siteUrl}${path}`;
  const image = ogImage ? urlFor(ogImage).width(1200).height(630).url() : `${siteUrl}/logopng.png`;

  return {
    title,
    description,
    alternates: { canonical: canonical || url },
    ...(noindex && { robots: { index: false, follow: true } }),
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
