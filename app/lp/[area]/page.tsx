import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSiteSettings } from "@/app/lib/getSiteSettings";
import { sanityFetch } from "@/app/lib/sanity";
import {
  singleAreaQuery,
  singleServiceLandingPageQuery,
  allAreaSlugsQuery,
  allServiceLandingPageSlugsQuery,
  testimonialsQuery,
  getAllServicesQuery,
} from "@/app/lib/queries";
import {
  type ServiceArea,
  type ServiceLandingPage,
  type Testimonial,
  type Service,
} from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";
import { buildMetadata } from "@/app/lib/seo";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb";
import JsonLd from "@/app/components/JsonLd";
import AreaLandingClient from "./AreaLandingClient";
import ServiceLandingClient from "./ServiceLandingClient";

export async function generateStaticParams() {
  const [lpSlugs, areaSlugs] = await Promise.all([
    sanityFetch<{ slug: string }[]>(allServiceLandingPageSlugsQuery),
    sanityFetch<{ slug: string }[]>(allAreaSlugsQuery),
  ]);
  return [...lpSlugs, ...areaSlugs].map(({ slug }) => ({ area: slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;

  const [settings, serviceLP, areaData] = await Promise.all([
    getSiteSettings(),
    sanityFetch<ServiceLandingPage | null>(singleServiceLandingPageQuery, { slug: area }),
    sanityFetch<ServiceArea | null>(singleAreaQuery, { slug: area }),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;
  const path = `/lp/${area}`;

  if (serviceLP) {
    return buildMetadata({
      title: serviceLP.seo?.title ?? `${serviceLP.heroHeading} | ${siteName}`,
      description: serviceLP.seo?.description ?? serviceLP.heroSubheading,
      path,
      siteUrl,
      siteName,
      ogImage: serviceLP.seo?.ogImage,
      canonical: serviceLP.seo?.canonical,
      noindex: serviceLP.seo?.noindex,
    });
  }

  if (areaData) {
    return buildMetadata({
      title: areaData.seo?.title ?? `Security Systems in ${areaData.name} | ${siteName}`,
      description: areaData.seo?.description ?? areaData.description,
      path,
      siteUrl,
      siteName,
      ogImage: areaData.seo?.ogImage,
      canonical: areaData.seo?.canonical,
      noindex: areaData.seo?.noindex,
    });
  }

  return { title: `Page Not Found | ${siteName}` };
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area } = await params;

  const [settings, serviceLP, areaData, testimonials, services] = await Promise.all([
    getSiteSettings(),
    sanityFetch<ServiceLandingPage | null>(singleServiceLandingPageQuery, { slug: area }),
    sanityFetch<ServiceArea | null>(singleAreaQuery, { slug: area }),
    sanityFetch<Testimonial[]>(testimonialsQuery),
    sanityFetch<Service[]>(getAllServicesQuery),
  ]);

  // Service LP takes priority over area LP
  if (serviceLP) {
    const serviceSchema = {
      "@context": "https://schema.org",
      "@type": "Service",
      name: serviceLP.heroHeading,
      description: serviceLP.heroSubheading ?? serviceLP.seo?.description,
      provider: {
        "@type": "LocalBusiness",
        "@id": `${siteConfig.seo.url}/#business`,
        name: settings.siteName,
        telephone: settings.phone,
      },
      url: `${siteConfig.seo.url}/lp/${area}`,
    };

    return (
      <>
        <JsonLd schema={serviceSchema} />
        <ServiceLandingClient
          page={serviceLP}
          settings={settings}
          testimonials={testimonials}
          services={services}
        />
      </>
    );
  }

  if (areaData) {
    const localBusinessSchema = {
      "@context": "https://schema.org",
      "@type": ["LocalBusiness", "SecurityService"],
      "@id": `${siteConfig.seo.url}/lp/${area}#business`,
      name: `${settings.siteName} — ${areaData.name} Security Systems`,
      description: areaData.description,
      url: `${siteConfig.seo.url}/lp/${area}`,
      telephone: settings.phone,
      email: settings.email,
      areaServed: { "@type": "City", name: areaData.name },
      parentOrganization: {
        "@type": "Organization",
        "@id": `${siteConfig.seo.url}/#organization`,
      },
      sameAs: [settings.social.facebook, settings.social.instagram, settings.social.google],
    };

    const breadcrumbSchema = buildBreadcrumbSchema(
      [
        { name: "Home", path: "" },
        { name: `Security Systems in ${areaData.name}`, path: `/lp/${area}` },
      ],
      siteConfig.seo.url,
    );

    return (
      <>
        <JsonLd schema={localBusinessSchema} />
        <JsonLd schema={breadcrumbSchema} />
        <AreaLandingClient
          settings={settings}
          areaData={areaData}
          testimonials={testimonials}
          services={services}
        />
      </>
    );
  }

  notFound();
}
