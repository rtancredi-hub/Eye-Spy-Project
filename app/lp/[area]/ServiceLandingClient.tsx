"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
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

// ─── DEFAULTS ─────────────────────────────────────────────────────────────────
const DEFAULT_INCLUDES = [
  "Free on-site property survey",
  "Written quote with no hidden fees",
  "Same-week availability",
  "No obligation — ever",
];

// ─── HEADER ───────────────────────────────────────────────────────────────────
function LandingHeader({ settings }: { settings: SiteSettings }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-base/95 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 md:px-16 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={siteConfig.brand.logo}
            alt={siteConfig.brand.logoAlt}
            width={195}
            height={56}
            className="h-14 w-auto object-contain"
            priority
          />
        </Link>
        <TrackedLink
          href={siteConfig.phoneHref}
          className="flex items-center gap-2 text-white font-bold text-sm hover:text-brand-accent transition-colors duration-200"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          <Phone size={14} className="text-brand-accent" />
          {settings.phone}
        </TrackedLink>
      </div>
    </header>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function LandingFooter({ settings }: { settings: SiteSettings }) {
  return (
    <footer className="border-t border-white/5 py-6 bg-brand-deep">
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
            className="text-slate-600 text-xs hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Privacy Policy
          </a>
          <span
            className="text-slate-600 text-xs"
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

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  return (
    <>
      <LandingHeader settings={settings} />

      <main className="bg-brand-base pt-16">
        {/* ── HERO + FORM ─────────────────────────────────────────────── */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 80% 80% at 20% 50%, rgba(0,180,255,0.07) 0%, transparent 60%)",
            }}
            aria-hidden
          />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

          <div className="relative max-w-6xl mx-auto px-6 md:px-16 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div className="flex flex-col gap-8">
              <motion.p
                custom={0}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-brand-accent text-xs uppercase tracking-widest"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {eyebrow}
              </motion.p>

              <motion.h1
                custom={1}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
                className="text-5xl md:text-6xl font-bold text-white leading-tight"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {page.heroHeading}
                {page.heroHeadingAccent && (
                  <>
                    <br />
                    <span
                      style={{
                        background:
                          "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      {page.heroHeadingAccent}
                    </span>
                  </>
                )}
              </motion.h1>

              {heroSubheading && (
                <motion.p
                  custom={2}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  className="text-slate-400 text-lg leading-relaxed max-w-lg"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {heroSubheading}
                </motion.p>
              )}

              <motion.ul
                custom={3}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
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
              </motion.ul>

              <motion.div
                custom={4}
                variants={fadeUp}
                initial="hidden"
                animate="visible"
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
              </motion.div>
            </div>

            {/* Right — form card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.3,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="bg-brand-surface border border-white/10 rounded-sm p-8"
            >
              <div className="mb-6">
                <h2
                  className="text-2xl font-bold text-white mb-1"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {formHeading}
                </h2>
                <p
                  className="text-slate-500 text-sm"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {formSubheading}
                </p>
              </div>
              <LPEstimateForm services={services} defaultService={defaultService} />
            </motion.div>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────────────────────────────────── */}
        <section className="relative bg-brand-surface py-12 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
          <div className="max-w-6xl mx-auto px-6 md:px-16">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { value: settings.stats.installs, label: "Systems Installed" },
                { value: settings.stats.years, label: "Years Experience" },
                { value: settings.stats.rating, label: "Google Rating" },
                { value: settings.stats.satisfaction, label: "Satisfaction Rate" },
              ].map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <span
                    className="text-3xl font-bold text-white"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {stat.value}
                  </span>
                  <span
                    className="text-xs uppercase tracking-widest text-slate-500"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ────────────────────────────────────────────── */}
        {testimonials.length > 0 && (
          <section className="relative bg-brand-base py-20 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
            <div className="max-w-6xl mx-auto px-6 md:px-16">
              <p
                className="text-brand-accent text-xs uppercase tracking-widest text-center mb-10"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                What Customers Say
              </p>
              <div
                className={
                  testimonials.length === 1
                    ? "grid grid-cols-1 gap-6 max-w-lg mx-auto"
                    : testimonials.length === 2
                      ? "grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto"
                      : "grid grid-cols-1 md:grid-cols-3 gap-6"
                }
              >
                {testimonials.map((t) => (
                  <div
                    key={t.name}
                    className="p-6 rounded-sm border border-white/5 bg-brand-surface flex flex-col gap-4"
                  >
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className="text-brand-accent fill-brand-accent" />
                      ))}
                    </div>
                    <p
                      className="text-slate-300 text-sm leading-relaxed flex-1"
                      style={{ fontFamily: "var(--font-dm-sans)" }}
                    >
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div>
                      <p
                        className="text-white text-sm font-bold"
                        style={{ fontFamily: "var(--font-rajdhani)" }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-slate-500 text-xs"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {t.location}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── BOTTOM CTA ──────────────────────────────────────────────── */}
        <section className="relative bg-brand-surface py-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
          <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-brand-accent/20" />
          <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-brand-accent/20" />
          <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-brand-accent/20" />
          <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-brand-accent/20" />

          <div className="max-w-2xl mx-auto px-6 md:px-16">
            <div className="text-center mb-10">
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
                  url: urlFor(img.asset).width(1200).url(),
                  alt: img.alt,
                }))}
            />
            <div className="bg-brand-base border border-white/10 rounded-sm p-8">
              <h3
                className="text-xl font-bold text-white mb-6"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Or Request Your Free Estimate Online
              </h3>
              <LPEstimateForm services={services} defaultService={defaultService} />
            </div>
          </div>
        </section>
      </main>

      <LandingFooter settings={settings} />
    </>
  );
}
