import { Suspense } from "react";
import type { Metadata } from "next";
import { getSiteSettings } from "@/app/lib/getSiteSettings";
import { sanityFetch } from "@/app/lib/sanity";
import { contactPageQuery } from "@/app/lib/queries";
import { type ContactPageData } from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";
import { buildMetadata } from "@/app/lib/seo";
import ContactClient from "./ContactClient";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, contactData] = await Promise.all([
    getSiteSettings(),
    sanityFetch<ContactPageData | null>(contactPageQuery),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;

  return buildMetadata({
    title: contactData?.seo?.title ?? `Contact Us | ${siteName}`,
    description:
      contactData?.seo?.description ?? contactData?.heroSubtitle ?? `Get in touch with ${siteName} for a free security system estimate.`,
    path: "/contact",
    siteUrl,
    siteName,
    ogImage: contactData?.seo?.ogImage,
    canonical: contactData?.seo?.canonical,
    noindex: contactData?.seo?.noindex,
  });
}

export default async function ContactPage() {
  const [settings, contactData] = await Promise.all([
    getSiteSettings(),
    sanityFetch<ContactPageData | null>(contactPageQuery),
  ]);
  return (
    <Suspense fallback={<div className="min-h-screen bg-brand-base" />}>
      <ContactClient settings={settings} contactData={contactData ?? {}} />
    </Suspense>
  );
}
