import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/app/lib/sanity";
import {
  singleServicePageQuery,
  allServicePageSlugsQuery,
} from "@/app/lib/queries";
import { type ServicePage } from "@/app/lib/types";
import { getServices } from "@/app/lib/getServices";
import { getSiteSettings } from "@/app/lib/getSiteSettings";
import { siteConfig } from "@/app/config/site";
import { buildMetadata } from "@/app/lib/seo";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb";
import JsonLd from "@/app/components/JsonLd";
import ServicePageClient from "./ServicePageClient";

export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>(allServicePageSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    sanityFetch<ServicePage | null>(singleServicePageQuery, { slug }),
    getSiteSettings(),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;
  if (!service) return { title: `Service Not Found | ${siteName}` };

  return buildMetadata({
    title: service.seo?.title ?? `${service.title} | ${siteName}`,
    description: service.seo?.description ?? service.shortDescription,
    path: `/services/${slug}`,
    siteUrl,
    siteName,
    ogImage: service.seo?.ogImage ?? (service.images?.[0]?.asset ? service.images[0].asset : undefined),
    canonical: service.seo?.canonical,
    noindex: service.seo?.noindex,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, services, settings] = await Promise.all([
    sanityFetch<ServicePage | null>(singleServicePageQuery, { slug }),
    getServices(),
    getSiteSettings(),
  ]);

  if (!service) notFound();

  const siteUrl = settings.siteUrl || siteConfig.seo.url;
  const ratingValue = settings.stats.rating.replace("★", "").trim();
  const reviewCount = settings.reviewCount ?? 124;

  const serviceSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/services/${slug}#service`,
    name: service.title,
    description: service.seo?.description ?? service.shortDescription ?? service.title,
    url: `${siteUrl}/services/${slug}`,
    serviceType: service.title,
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#business`,
    },
    areaServed: {
      "@type": "City",
      name: siteConfig.addressCity,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue,
      reviewCount: String(reviewCount),
      bestRating: "5",
      worstRating: "1",
    },
  };

  if (service.priceLabel) {
    serviceSchema.offers = {
      "@type": "Offer",
      name: service.priceLabel,
      description: service.priceNote,
      seller: {
        "@type": "LocalBusiness",
        "@id": `${siteUrl}/#business`,
      },
    };
  }

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "" },
      { name: "Services", path: "/services" },
      { name: service.title, path: `/services/${slug}` },
    ],
    siteUrl,
  );

  return (
    <>
      <JsonLd schema={serviceSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <ServicePageClient service={service} services={services} />
    </>
  );
}
