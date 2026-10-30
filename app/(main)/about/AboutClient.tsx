"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Users,
  Clock,
  Award,
  ArrowRight,
  Heart,
  Star,
  Wrench,
  Eye,
  Lock,
} from "lucide-react";
import { type SiteSettings, type TeamMember, type AboutPageData } from "@/app/lib/types";

const iconMap: Record<string, React.ReactNode> = {
  shieldCheck: <ShieldCheck size={20} />,
  award: <Award size={20} />,
  clock: <Clock size={20} />,
  heart: <Heart size={20} />,
  star: <Star size={20} />,
  users: <Users size={20} />,
  wrench: <Wrench size={20} />,
  eye: <Eye size={20} />,
  lock: <Lock size={20} />,
};

const defaultValues = [
  {
    iconName: "shieldCheck",
    title: "Integrity First",
    description:
      "We recommend only what your property actually needs. No upselling, no unnecessary equipment.",
  },
  {
    iconName: "award",
    title: "Quality Workmanship",
    description:
      "Every installation is done to a professional standard we'd be proud to put our name on.",
  },
  {
    iconName: "clock",
    title: "Respect Your Time",
    description:
      "We show up when we say we will, finish when we say we will, and clean up after ourselves.",
  },
  {
    iconName: "heart",
    title: "Community Focused",
    description:
      "We're a local business serving our neighbors. Your safety is something we take personally.",
  },
];

const defaultStoryParagraphs = [
  "{siteName} started in a garage with one van, one technician, and a handshake promise to always be straight with customers. That was 15 years ago.",
  "Today we've grown to a full team serving hundreds of homeowners and businesses across the region — but the promise hasn't changed. We'll tell you exactly what you need, install it properly, and be there if anything ever goes wrong.",
  "We're not a franchise. We're not a national chain. We're your neighbors, and we treat every property like it's our own.",
];

export default function AboutClient({
  settings,
  team,
  aboutData,
}: {
  settings: SiteSettings;
  team: TeamMember[];
  aboutData: AboutPageData;
}) {
  const storyRef = useRef<HTMLElement>(null);
  const valuesRef = useRef<HTMLElement>(null);
  const teamRef = useRef<HTMLElement>(null);

  const storyInView = useInView(storyRef, { once: true, amount: 0.2 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.1 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.1 });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.12,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const values =
    aboutData.values && aboutData.values.length > 0
      ? aboutData.values
      : defaultValues;

  const storyParagraphs =
    aboutData.storyParagraphs && aboutData.storyParagraphs.length > 0
      ? aboutData.storyParagraphs
      : defaultStoryParagraphs;

  return (
    <main className="bg-page">
      {/* ── HERO BANNER ─────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden bg-page">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,107,77,0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-orange-700 text-xs uppercase tracking-widest mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aboutData.heroEyebrow ?? "Our Story"}
          </motion.p>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold text-brand-base leading-tight mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aboutData.heroHeadingLine1 ?? "Security Done Right,"}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {aboutData.heroHeadingLine2 ?? "By People You Can Trust."}
            </span>
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-600 text-lg max-w-2xl leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {aboutData.heroSubtitle ??
              `${settings.siteName} was built on a simple belief — every home and business deserves honest, professional security without the hard sell.`}
          </motion.p>
        </div>
      </section>

      {/* ── OUR STORY ───────────────────────────────────────────────────────── */}
      <section
        ref={storyRef}
        className="relative bg-page-alt py-24 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <motion.div
          initial="hidden"
          animate={storyInView ? "visible" : "hidden"}
          variants={containerVariants}
          className="max-w-6xl mx-auto px-6 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={itemVariants}>
            <p
              className="text-orange-700 text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              {aboutData.storyEyebrow ?? "How We Started"}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-brand-base mb-6"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              {aboutData.storyHeading ?? (
                <>
                  15 Years of Protecting
                  <br />
                  What Matters Most
                </>
              )}
            </h2>
            <div
              className="flex flex-col gap-4 text-slate-600 leading-relaxed"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {storyParagraphs.map((para, i) => (
                <p key={i}>
                  {para.replace("{siteName}", settings.siteName)}
                </p>
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: settings.stats.installs, label: "Systems Installed" },
              { value: settings.stats.years, label: "Years in Business" },
              { value: settings.stats.rating, label: "Average Rating" },
              { value: "100%", label: "Local & Independent" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white border border-slate-200 rounded-sm p-6 flex flex-col gap-2"
              >
                <span
                  className="text-4xl font-bold text-brand-base"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {stat.value}
                </span>
                <span
                  className="text-xs text-slate-600 uppercase tracking-widest"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── CORE VALUES ─────────────────────────────────────────────────────── */}
      <section
        ref={valuesRef}
        className="relative bg-page py-24 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="flex flex-col items-center text-center mb-14">
            <p
              className="text-orange-700 text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              {aboutData.valuesEyebrow ?? "What Drives Us"}
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-brand-base"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              {aboutData.valuesHeading ?? "Our Core Values"}
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="group p-6 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent/10 text-orange-700 mb-4 group-hover:bg-brand-accent/20 transition-colors duration-300">
                  {value.iconName
                    ? (iconMap[value.iconName] ?? <ShieldCheck size={20} />)
                    : <ShieldCheck size={20} />}
                </span>
                <h3
                  className="text-base font-bold text-brand-base mb-2"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {value.title}
                </h3>
                <p
                  className="text-slate-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────────── */}
      <section
        ref={teamRef}
        className="relative bg-page-alt py-24 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="flex flex-col items-center text-center mb-14">
            <p
              className="text-orange-700 text-xs uppercase tracking-widest mb-4"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              The People Behind The Work
            </p>
            <h2
              className="text-4xl md:text-5xl font-bold text-brand-base"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Meet The Team
            </h2>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={itemVariants}
                className="group p-8 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-5">
                  <Users size={22} className="text-orange-700/60" />
                </div>
                <h3
                  className="text-lg font-bold text-brand-base mb-1"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {member.name}
                </h3>
                <p
                  className="text-orange-700 text-xs uppercase tracking-widest mb-1"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {member.role}
                </p>
                <p
                  className="text-slate-500 text-xs mb-4"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {member.years}
                </p>
                <p
                  className="text-slate-600 text-sm leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {member.bio}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="relative bg-page py-24 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-brand-accent/20" />
        <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-brand-accent/20" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-brand-accent/20" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-brand-accent/20" />

        <div className="max-w-3xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <p
            className="text-orange-700 text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aboutData.ctaEyebrow ?? "Ready to Get Started?"}
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-brand-base mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aboutData.ctaHeading ?? "Let's Protect Your Property"}
          </h2>
          <p
            className="text-slate-600 text-lg max-w-xl mb-10 leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {aboutData.ctaBody ??
              "Get a no-obligation estimate from a team that will actually show up, do the job right, and be there if you ever need us."}
          </p>
          <a
            href="/#estimate-form"
            className="group flex items-center gap-3 bg-brand-accent text-brand-base font-bold px-10 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {aboutData.ctaButtonLabel ?? "Get a Free Estimate"}
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>
        </div>
      </section>
    </main>
  );
}
