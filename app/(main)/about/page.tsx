import type { Metadata } from "next";
import { getSiteSettings } from "@/app/lib/getSiteSettings";
import { sanityFetch } from "@/app/lib/sanity";
import { teamQuery, aboutPageQuery } from "@/app/lib/queries";
import { type TeamMember, type AboutPageData } from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";
import { buildMetadata } from "@/app/lib/seo";
import AboutClient from "./AboutClient";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, aboutData] = await Promise.all([
    getSiteSettings(),
    sanityFetch<AboutPageData | null>(aboutPageQuery),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;

  return buildMetadata({
    title: aboutData?.seo?.title ?? `About Us | ${siteName}`,
    description:
      aboutData?.seo?.description ?? aboutData?.heroSubtitle ?? `Learn about ${siteName} and our security installation team.`,
    path: "/about",
    siteUrl,
    siteName,
    ogImage: aboutData?.seo?.ogImage,
    canonical: aboutData?.seo?.canonical,
    noindex: aboutData?.seo?.noindex,
  });
}

export default async function AboutPage() {
  const [settings, team, aboutData] = await Promise.all([
    getSiteSettings(),
    sanityFetch<TeamMember[]>(teamQuery),
    sanityFetch<AboutPageData | null>(aboutPageQuery),
  ]);
  return <AboutClient settings={settings} team={team} aboutData={aboutData ?? {}} />;
}
