"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import {
  ShieldCheck,
  BadgeCheck,
  Star,
  Users,
  Clock,
  Award,
} from "lucide-react";
import { type SiteSettings } from "../lib/types";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
  port: string; // cable port identifier label
}

interface Cert {
  icon: React.ReactNode;
  label: string;
}

export default function SocialProof({ settings }: { settings: SiteSettings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
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

  const stats: Stat[] = [
    {
      value: settings.stats.years,
      label: "Years in Business",
      icon: <Clock size={18} />,
      port: "PORT 01",
    },
    {
      value: settings.stats.installs,
      label: "Systems Installed",
      icon: <Users size={18} />,
      port: "PORT 02",
    },
    {
      value: settings.stats.rating,
      label: "Average Rating",
      icon: <Star size={18} />,
      port: "PORT 03",
    },
  ];

  const certs: Cert[] = [
    { icon: <ShieldCheck size={16} />, label: "Licensed & Insured" },
    { icon: <BadgeCheck size={16} />, label: "BBB Accredited" },
    { icon: <Award size={16} />, label: "Certified Installer" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative bg-page-alt overflow-hidden py-24"
    >
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(239,107,77,0.04) 0%, transparent 70%)",
        }}
        aria-hidden
      />
      {/* Faint radial glow on the right — atmospheric depth */}
      <div
        className="pointer-events-none absolute -right-40 top-1/2 -translate-y-1/2 w-80 h-80 rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, var(--brand-accent) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-6xl mx-auto px-6 md:px-16 flex flex-col lg:flex-row items-center gap-10 lg:gap-0"
      >
        {/* ── LEFT: STATS ──────────────────────────────────────────────────── */}
        <div className="flex-1 w-full">
          {/* Section eyebrow — styled as a P-touch cable label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1 mb-6 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs"
          >
            <span
              className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase"
            >
              STATS / CREDENTIALS
            </span>
          </motion.div>

          {/* Stats grid — gap-px border trick */}
          <div className="grid grid-cols-3 gap-px bg-slate-200 rounded-sm overflow-hidden">
            {stats.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="group bg-page-alt hover:bg-white transition-colors duration-300 px-6 py-8 flex flex-col items-center gap-3
                           border-l-2 border-brand-accent/20 md:border-l-0"
              >
                {/* Port label — P-touch identifier above icon */}
                <span
                  className="font-mono text-[9px] tracking-widest text-orange-700/70 uppercase"
                >
                  {stat.port}
                </span>

                <span className="text-orange-700 opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                  {stat.icon}
                </span>

                <span
                  className="text-3xl md:text-4xl font-bold text-text-primary"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {stat.value}
                </span>

                <span
                  className="text-xs text-text-muted uppercase tracking-widest text-center leading-tight"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ── CABLE RUN DIVIDER (desktop) ───────────────────────────────────
            An SVG H-shape cable bridging the two columns — replaces the plain
            gradient line. Hidden on mobile where columns stack vertically.
        */}
        <div className="hidden lg:flex self-stretch items-center justify-center w-32 mx-8 shrink-0" aria-hidden="true">
          <svg width="64" height="100%" viewBox="0 0 64 120" preserveAspectRatio="xMidYMid meet" style={{ overflow: "visible" }}>
            {/* Glow */}
            <motion.path
              d="M 32,0 L 32,52 L 16,52 L 16,68 L 48,68 L 48,52 L 32,52 L 32,120"
              stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
              fill="none" strokeLinecap="square"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ pathLength: { duration: 0.8, delay: 0.3, ease: "easeInOut" }, opacity: { duration: 0.01, delay: 0.3 } }}
            />
            {/* Main line */}
            <motion.path
              d="M 32,0 L 32,52 L 16,52 L 16,68 L 48,68 L 48,52 L 32,52 L 32,120"
              stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
              fill="none" strokeLinecap="square"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ pathLength: { duration: 0.8, delay: 0.3, ease: "easeInOut" }, opacity: { duration: 0.01, delay: 0.3 } }}
            />
            {/* Junction dots */}
            {[{ cx: 32, cy: 52 }, { cx: 16, cy: 52 }, { cx: 48, cy: 52 }, { cx: 16, cy: 68 }, { cx: 48, cy: 68 }, { cx: 32, cy: 68 }].map((dot, i) => (
              <motion.circle key={i} cx={dot.cx} cy={dot.cy} r="3" fill="#EF6B4D" fillOpacity="0.8"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={{ duration: 0.2, delay: 1.1 + i * 0.05 }}
              />
            ))}
          </svg>
        </div>

        {/* ── RIGHT: CERTIFICATIONS ────────────────────────────────────────── */}
        <div className="shrink-0 flex flex-col gap-4 w-full lg:w-auto">
          {/* Credentials label */}
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-1 mb-2 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs"
          >
            <span
              className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase"
            >
              CREDENTIALS
            </span>
          </motion.div>

          {certs.map((cert, i) => (
            <motion.div
              key={cert.label}
              variants={itemVariants}
              className="group flex items-center gap-4 px-6 py-4 rounded-sm border border-slate-200 hover:border-brand-accent/20 hover:bg-brand-accent/5 transition-all duration-300 cursor-default
                         border-l-2 border-l-brand-accent/20 md:border-l"
            >
              {/* Port number badge */}
              <span
                className="font-mono text-[8px] tracking-widest text-orange-700/60 uppercase shrink-0 hidden sm:block"
              >
                P{String(i + 1).padStart(2, "0")}
              </span>

              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-accent/10 text-orange-700 shrink-0 group-hover:bg-brand-accent/20 transition-colors duration-300">
                {cert.icon}
              </span>

              <span
                className="text-sm text-text-nav tracking-wider group-hover:text-text-primary transition-colors duration-300 whitespace-nowrap"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {cert.label}
              </span>

              {/* Junction dot — appears on hover, matching cable spec */}
              <span className="ml-auto w-2 h-2 bg-brand-accent opacity-0 group-hover:opacity-60 transition-opacity duration-300 shrink-0" style={{ borderRadius: 0 }} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
