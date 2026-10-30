"use client";

import React from "react";
import {
  ShieldCheck,
  Phone,
  CheckCircle,
  Star,
  BadgeCheck,
  Clock,
  Users,
} from "lucide-react";
import { siteConfig } from "../../config/site";
import {
  type SiteSettings,
  type Testimonial,
  type Service,
  type ServiceLandingPage,
} from "../../lib/types";
import Image from "next/image";
import Link from "next/link";
import { urlFor } from "../../lib/sanity";
import PhotoCarousel from "../../components/PhotoCarousel";
import TrackedLink from "../components/TrackedLink";
import LPEstimateForm from "../components/LPEstimateForm";
import LPTestimonialCarousel from "../components/LPTestimonialCarousel";
import LPGridBackground from "../components/LPGridBackground";

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULT_INCLUDES = [
  "Free on-site property survey",
  "Written quote with no hidden fees",
  "Same-week availability",
  "No obligation — ever",
];

// ─── HEADER ───────────────────────────────────────────────────────────────────
function LandingHeader({ settings }: { settings: SiteSettings }) {
  const trustItems = [
    { icon: <BadgeCheck size={14} />, label: "Licensed & Insured" },
    { icon: <Users size={14} />, label: `${settings.stats.installs} Installs` },
    {
      icon: <Clock size={14} />,
      // Industry experience, not years in business. Sanity's value may
      // already include "Years" (e.g. "15+ Years").
      label: `${settings.stats.years}${/year/i.test(settings.stats.years) ? "" : " Years"} Experience`,
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#0f1d33]/95 backdrop-blur-sm shadow-lg shadow-black/40">
      {/* Glowing "lit fiber" line along the bottom edge */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/70 to-transparent" aria-hidden />
      <div className="absolute -bottom-1 left-1/4 right-1/4 h-1 bg-brand-accent/30 blur-sm" aria-hidden />

      <div className="max-w-6xl mx-auto px-6 md:px-16 h-16 flex items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src={siteConfig.brand.logo}
            alt={siteConfig.brand.logoAlt}
            width={195}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>

        <ul className="hidden xl:flex items-center gap-5">
          {trustItems.map((item) => (
            <li
              key={item.label}
              className="flex items-center gap-1.5 text-slate-300 text-xs uppercase tracking-wider"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              <span className="text-brand-accent">{item.icon}</span>
              {item.label}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-5 shrink-0">
          <TrackedLink
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 text-white font-bold text-sm hover:text-brand-accent transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            <Phone size={14} className="text-brand-accent" />
            {settings.phone}
          </TrackedLink>
          {/* Phones already have the sticky bottom CTA bar */}
          <a
            href="#estimate"
            className="hidden lg:inline-flex items-center px-4 py-2 rounded-sm bg-brand-accent text-brand-base font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Free Estimate
          </a>
        </div>
      </div>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function LandingFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/5 pt-6 pb-24 lg:pb-6 bg-brand-deep">
      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2">
          <ShieldCheck className="text-brand-accent" size={16} strokeWidth={2.2} />
          <span
            className="text-white text-xs font-semibold tracking-widest uppercase"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {settings.siteName}
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <a
            href="/privacy"
            className="text-slate-400 text-xs hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Privacy Policy
          </a>
          <span
            className="text-slate-400 text-xs"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

// ─── CLIENT COMPONENT ─────────────────────────────────────────────────────────
export default function ServiceLandingClient({
  page,
  settings,
  testimonials,
  services,
}: {
  page: ServiceLandingPage;
  settings: SiteSettings;
  testimonials: Testimonial[];
  services: Service[];
}) {
  const includes =
    page.includesList?.length
      ? page.includesList
      : page.linkedService?.features?.length
        ? page.linkedService.features
        : DEFAULT_INCLUDES;

  const heroSubheading = page.heroSubheading ?? page.linkedService?.shortDescription;
  const defaultService = page.linkedService?.slug;

  const eyebrow = page.heroEyebrow ?? `Licensed & Insured · ${settings.serviceArea}`;
  const bottomCtaEyebrow = page.bottomCtaEyebrow ?? "Still Have Questions?";
  const bottomCtaHeading = page.bottomCtaHeading ?? "Talk to Us First";
  const bottomCtaBody =
    page.bottomCtaBody ??
    "Prefer to speak with someone before filling out a form? Give us a call and we'll answer any questions you have.";
  const formHeading = page.formHeading ?? "Request Your Free Estimate";
  const formSubheading = page.formSubheading ?? "We'll respond within 1 business day.";

  const trustBadges = [
    { icon: <BadgeCheck size={16} />, label: "Licensed & Insured" },
    { icon: <Clock size={16} />, label: `${settings.stats.years} Experience` },
    { icon: <Star size={16} />, label: `${settings.stats.rating} Google Rated` },
    { icon: <Users size={16} />, label: `${settings.stats.installs} Installs` },
  ];

  return (
    <>
      <LandingHeader settings={settings} />

      <main className="bg-brand-base pt-16">
        {/* ── HERO + FORM ─────────────────────────────────────────────── */}
        <section className="relative overflow-hidden">
          <LPGridBackground />
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 20% 50%, rgba(0,180,255,0.07) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

          {/* Mobile order: headline → form + reviews → checklist + badges.
              Desktop: left column (headline, checklist) beside form + reviews. */}
          <div className="relative max-w-6xl mx-auto px-6 md:px-16 py-10 lg:py-14 grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-10 lg:gap-x-16 lg:gap-y-8 items-start content-start w-full">
            <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-1">
              <p
                className="text-brand-accent text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {eyebrow}
              </p>

              <h1
                className="text-4xl md:text-5xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {page.heroHeading}
                {page.heroHeadingAccent && (
                  <>
                    <br />
                                       <span className="inline-block text-brand-accent lg:bg-linear-to-r lg:from-brand-accent lg:via-brand-accent-light lg:to-brand-accent-lighter lg:bg-clip-text lg:text-transparent">
                      {page.heroHeadingAccent}
                    </span>
                  </>
                )}
              </h1>

              {heroSubheading && (
                <p
                  className="text-slate-300 text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {heroSubheading}
                </p>
              )}
            </div>

            {/* Right — form card + reviews */}
            <div
              className="flex flex-col gap-6 lg:col-start-2 lg:row-start-1 lg:row-span-2"
            >
              <div
                id="estimate"
                className="scroll-mt-20 bg-[#0c1a2e] border border-white/10 rounded-sm p-8"
              >
                <div className="mb-6">
                  <p
                    className="flex items-center gap-2 mb-3 text-emerald-400 text-xs uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping motion-reduce:animate-none" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Same-week site visits available
                  </p>
                  <h2
                    className="text-2xl font-bold text-white mb-1"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {formHeading}
                  </h2>
                  <p
                    className="text-slate-400 text-sm"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {formSubheading}
                  </p>
                </div>
                <LPEstimateForm services={services} defaultService={defaultService} idPrefix="lp-top" />
              </div>
              <LPTestimonialCarousel testimonials={testimonials} />
            </div>

            <div className="flex flex-col gap-8 lg:col-start-1 lg:row-start-2">
              <ul
                className="flex flex-col gap-3"
              >
                {includes.map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle size={16} className="text-brand-accent shrink-0" />
                    <span
                      className="text-slate-300 text-sm"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              <div
                className="flex flex-wrap gap-3"
              >
                {trustBadges.map((badge) => (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 px-3 py-2 rounded-sm border border-white/10 bg-white/5"
                  >
                    <span className="text-brand-accent">{badge.icon}</span>
                    <span
                      className="text-slate-300 text-xs"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      {badge.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
        <section className="relative bg-brand-surface py-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
          <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-brand-accent/20" />
          <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-brand-accent/20" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-brand-accent/20" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-brand-accent/20" />

          <div className="max-w-4xl mx-auto px-6 md:px-16">
            <div className="text-center mb-10 max-w-2xl mx-auto">
              <p
                className="text-brand-accent text-xs uppercase tracking-widest mb-4"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {bottomCtaEyebrow}
              </p>
              <h2
                className="text-4xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {bottomCtaHeading}
              </h2>
              <p
                className="text-slate-400 leading-relaxed"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {bottomCtaBody}
              </p>
              <TrackedLink
                href={siteConfig.phoneHref}
                className="inline-flex items-center gap-2 mt-6 text-brand-accent font-bold text-lg hover:text-white transition-colors duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                <Phone size={18} />
                {settings.phone}
              </TrackedLink>
            </div>

            <PhotoCarousel
              images={(page.formPhotos ?? [])
                .filter((img) => img?.asset)
                .map((img) => ({
                  url: urlFor(img).width(1200).height(900).fit("crop").url(),
                  alt: img.alt,
                }))}
            />
            <div className="max-w-2xl mx-auto bg-[#0c1a2e] border border-white/10 rounded-sm p-8">
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Or Request Your Free Estimate Online
              </h3>
              <LPEstimateForm services={services} defaultService={defaultService} idPrefix="lp-bottom" />
            </div>
          </div>
        </section>
      </main>

      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 grid grid-cols-2 gap-2 p-3 bg-brand-base/95 backdrop-blur-sm border-t border-white/10">
        <TrackedLink
          href={siteConfig.phoneHref}
          className="flex items-center justify-center gap-2 py-3 rounded-sm bg-brand-accent text-brand-base font-bold text-sm uppercase tracking-widest"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          <Phone size={16} />
          Call Now
        </TrackedLink>
        <a
          href="#estimate"
          className="flex items-center justify-center py-3 rounded-sm border border-brand-accent text-brand-accent font-bold text-sm uppercase tracking-widest"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          Free Estimate
        </a>
      </div>

      <LandingFooter settings={settings} />
    </>
  );
}
