import type { Metadata } from "next";
import { Rajdhani, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import { siteConfig } from "./config/site";
import { getSiteSettings } from "./lib/getSiteSettings";
import { getServices } from "./lib/getServices";
import { buildMetadata } from "./lib/seo";
import JsonLd from "./components/JsonLd";

const rajdhani = Rajdhani({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-rajdhani",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const siteName = settings.siteName || siteConfig.name;
  const description = settings.description || siteConfig.description;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;

  const base = buildMetadata({
    title: `${siteName} | Security System Installation`,
    description,
    path: "/",
    siteUrl,
    siteName,
  });

  return {
    ...base,
    openGraph: { ...base.openGraph, locale: "en_US" },
    keywords: siteConfig.seo.keywords,
    metadataBase: new URL(siteUrl),
    icons: {
      icon: [
        { url: "/favicons/icon-16.png", sizes: "16x16", type: "image/png" },
        { url: "/favicons/icon-32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicons/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [
        { url: "/favicons/icon-180.png", sizes: "180x180", type: "image/png" },
      ],
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, services] = await Promise.all([
    getSiteSettings(),
    getServices(),
  ]);

  const siteUrl = settings.siteUrl || siteConfig.seo.url;


  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "SecurityService"],
    "@id": `${siteUrl}/#business`,
    name: settings.siteName,
    description: settings.description,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/favicons/icon-512.png`,
    },
    image: `${siteUrl}/logopng.png`,
    telephone: settings.phone,
    email: settings.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.addressStreet,
      addressLocality: siteConfig.addressCity,
      addressRegion: siteConfig.addressRegion,
      postalCode: siteConfig.addressPostal,
      addressCountry: "US",
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.addressCity,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "16:00",
      },
    ],
   
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Security System Installation Services",
      itemListElement: services
        .filter((s) => s.slug !== "other")
        .map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.title,
            url: `${siteUrl}/services/${s.slug}`,
          },
        })),
    },
    sameAs: [
      settings.social.facebook,
      settings.social.instagram,
      settings.social.google,
    ].filter(Boolean),
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: settings.siteName,
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/favicons/icon-512.png`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phone,
      contactType: "customer service",
      availableLanguage: "English",
    },
    sameAs: [
      settings.social.facebook,
      settings.social.instagram,
      settings.social.google,
    ].filter(Boolean),
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: settings.siteName,
    publisher: {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
    },
  };

  return (
    <html lang="en" className={`${rajdhani.variable} ${dmSans.variable}`}>
      <head>
        <JsonLd schema={localBusinessSchema} />
        <JsonLd schema={organizationSchema} />
        <JsonLd schema={websiteSchema} />
      </head>
      <body className="antialiased">{children}</body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}
