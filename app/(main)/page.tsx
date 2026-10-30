import type { Metadata } from "next";
import Hero from "../components/Hero";
import SocialProof from "../components/SocialProof";
import Benefits from "../components/Benefits";
import Services from "../components/Services";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import CTA from "../components/CTA";
import FAQ from "../components/FAQ";
import EstimateForm from "../components/EstimateForm";
import CableSeparator from "../components/CableSeparator";
import JsonLd from "../components/JsonLd";
import { getSiteSettings } from "../lib/getSiteSettings";
import { getServices } from "../lib/getServices";
import { getHomePage } from "../lib/getHomePage";
import { sanityFetch } from "../lib/sanity";
import { testimonialsQuery, faqQuery } from "../lib/queries";
import { type Testimonial, type FaqItem } from "../lib/types";
import { howItWorksSteps } from "../config/howItWorks";
import { siteConfig } from "../config/site";
import { buildMetadata } from "../lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, homePage] = await Promise.all([
    getSiteSettings(),
    getHomePage(),
  ]);

  const siteName = settings.siteName || siteConfig.name;
  const siteUrl = settings.siteUrl || siteConfig.seo.url;

  return buildMetadata({
    title: homePage?.seo?.title ?? `${siteName} | Security System Installation`,
    description: homePage?.seo?.description ?? (settings.description || siteConfig.description),
    path: "/",
    siteUrl,
    siteName,
    ogImage: homePage?.seo?.ogImage,
    canonical: homePage?.seo?.canonical,
    noindex: homePage?.seo?.noindex,
  });
}

export default async function Home() {
  const [settings, testimonials, faqItems, services, homePage] = await Promise.all([
    getSiteSettings(),
    sanityFetch<Testimonial[]>(testimonialsQuery),
    sanityFetch<FaqItem[]>(faqQuery),
    getServices(),
    getHomePage(),
  ]);

  const faqPageSchema = faqItems.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqItems.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      }
    : null;

  const activeSteps = homePage?.howItWorksSteps?.length
    ? homePage.howItWorksSteps
    : howItWorksSteps;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to Get a Security System Installed",
    description: homePage?.howItWorksSubheading ?? "Our simple process to get you up and running quickly.",
    step: activeSteps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
    provider: {
      "@type": "LocalBusiness",
      "@id": `${siteConfig.seo.url}/#business`,
    },
  };

  return (
    <main className="bg-page">
      {faqPageSchema && <JsonLd schema={faqPageSchema} />}
      <JsonLd schema={howToSchema} />
      <Hero
        settings={settings}
        services={services}
        heroHeading={homePage?.heroHeading}
        heroHeadingAccent={homePage?.heroHeadingAccent}
        heroSubheading={homePage?.heroSubheading}
      />
      <CableSeparator variant="patch-panel" topColor="#f6f5f2" bottomColor="#ecebe6" />
      <SocialProof settings={settings} />
      <CableSeparator variant="switch" topColor="#ecebe6" bottomColor="#ecebe6" />
      <Benefits
        benefits={homePage?.benefits}
        eyebrow={homePage?.benefitsEyebrow}
        heading={homePage?.benefitsHeading}
        subheading={homePage?.benefitsSubheading}
      />
      <CableSeparator variant="cable-tray" topColor="#ecebe6" bottomColor="#ecebe6" />
      <Services services={services} />
      <CableSeparator variant="router" topColor="#ecebe6" bottomColor="#f6f5f2" />
      <HowItWorks
        steps={homePage?.howItWorksSteps}
        eyebrow={homePage?.howItWorksEyebrow}
        heading={homePage?.howItWorksHeading}
        subheading={homePage?.howItWorksSubheading}
      />
      <CableSeparator variant="conduit" topColor="#f6f5f2" bottomColor="#ecebe6" />
      <Testimonials testimonials={testimonials} />
      <CableSeparator variant="patch-panel" label="FEED-RISER" topColor="#ecebe6" bottomColor="#f6f5f2" />
      <CTA settings={settings} />
      <CableSeparator variant="switch" label="SW-02" topColor="#f6f5f2" bottomColor="#ecebe6" />
      <FAQ items={faqItems} />
      <CableSeparator variant="conduit" label="TERM-BLOCK" topColor="#ecebe6" bottomColor="#f6f5f2" />
      <EstimateForm services={services} />
    </main>
  );
}
