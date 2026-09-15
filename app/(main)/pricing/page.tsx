import type { Metadata } from "next";
import { sanityFetch } from "@/app/lib/sanity";
import { pricingPageQuery, pricingServicesQuery } from "@/app/lib/queries";
import { getServices } from "@/app/lib/getServices";
import { getSiteSettings } from "@/app/lib/getSiteSettings";
import { type PricingPage, type PricingService } from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";
import { buildMetadata } from "@/app/lib/seo";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb";
import JsonLd from "@/app/components/JsonLd";
import PricingPageClient from "./PricingPageClient";

export async function generateMetadata(): Promise<Metadata> {
  const [pricingData, settings] = await Promise.all([
    sanityFetch<PricingPage | null>(pricingPageQuery),
    getSiteSettings(),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;
  const title = pricingData?.seo?.title
    ?? (pricingData?.pageTitle ? `${pricingData.pageTitle} | ${siteName}` : `Pricing | ${siteName}`);
  const description =
    pricingData?.seo?.description ??
    pricingData?.pageSubtitle ??
    `Transparent pricing for CCTV, alarm systems, access control, and cabling. No hidden fees — get a free estimate today.`;

  return buildMetadata({
    title,
    description,
    path: "/pricing",
    siteUrl,
    siteName,
    ogImage: pricingData?.seo?.ogImage,
    canonical: pricingData?.seo?.canonical,
    noindex: pricingData?.seo?.noindex,
  });
}

export default async function PricingPage() {
  const [pricingData, pricingServices, services, settings] = await Promise.all([
    sanityFetch<PricingPage | null>(pricingPageQuery),
    sanityFetch<PricingService[]>(pricingServicesQuery),
    getServices(),
    getSiteSettings(),
  ]);

  const siteUrl = settings.siteUrl || siteConfig.seo.url;

  const faqSchema =
    pricingData?.faqItems && pricingData.faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: pricingData.faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "" },
      { name: "Pricing", path: "/pricing" },
    ],
    siteUrl,
  );

  return (
    <>
      {faqSchema && <JsonLd schema={faqSchema} />}
      <JsonLd schema={breadcrumbSchema} />
      <PricingPageClient
        pricingData={pricingData}
        pricingServices={pricingServices}
        services={services}
      />
    </>
  );
}
