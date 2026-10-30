"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "../config/site";
import { type SiteSettings } from "../lib/types";

export default function CTA({ settings }: { settings: SiteSettings }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const prefersReducedMotion = useReducedMotion();

  const variants: Variants = {
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

  const cableVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: prefersReducedMotion ? 0 : 0.9, delay: 0.1, ease: "easeInOut" },
        opacity: { duration: 0.01, delay: 0.1 },
      },
    },
  };

  const scrollToForm = () => {
    document
      .getElementById("estimate-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-page py-32 overflow-hidden"
    >
      {/* Atmospheric glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 50% 50%, rgba(239,107,77,0.07) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      {/* ── CABLE SVG OVERLAY ──────────────────────────────────────────────────
          A cable enters from the left, routes to the content box boundary,
          and a second exits to the right. Desktop only.
      */}
      <div className="hidden md:block absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          {/* Left cable — enters from left edge, runs to content center */}
          <motion.path
            d="M 0,50% L 18%,50%"
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants}
            initial="hidden" animate={isInView ? "visible" : "hidden"}
          />
          <motion.path
            d="M 0,50% L 18%,50%"
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants}
            initial="hidden" animate={isInView ? "visible" : "hidden"}
          />
          {/* Right cable */}
          <motion.path
            d="M 82%,50% L 100%,50%"
            stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
            fill="none" strokeLinecap="square"
            variants={cableVariants}
            initial="hidden" animate={isInView ? "visible" : "hidden"}
          />
          <motion.path
            d="M 82%,50% L 100%,50%"
            stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
            fill="none" strokeLinecap="square"
            variants={cableVariants}
            initial="hidden" animate={isInView ? "visible" : "hidden"}
          />
          {/* Terminus dots */}
          <motion.circle cx="18%" cy="50%" r="3" fill="#EF6B4D" fillOpacity="0.8"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: prefersReducedMotion ? 0 : 1.0 }}
          />
          <motion.circle cx="82%" cy="50%" r="3" fill="#EF6B4D" fillOpacity="0.8"
            initial={{ scale: 0, opacity: 0 }}
            animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
            transition={{ duration: 0.2, delay: prefersReducedMotion ? 0 : 1.0 }}
          />
        </svg>
      </div>

      {/* ── CORNER ACCENTS — port-housing style with cable label tags ──────── */}
      {/* Top-left */}
      <div className="absolute top-6 left-6 w-10 h-10 border-l border-t border-brand-accent/40" />
      <div className="absolute top-6 left-6 mt-1 ml-1">
        <div className="inline-flex items-center gap-1 border border-brand-accent/40 bg-brand-accent/5 px-1.5 py-px rounded-xs">
          <span className="text-orange-700/70 font-mono text-[8px] tracking-widest uppercase">PORT A</span>
        </div>
      </div>

      {/* Top-right */}
      <div className="absolute top-6 right-6 w-10 h-10 border-r border-t border-brand-accent/40" />
      <div className="absolute top-6 right-6 mt-1 mr-1 flex justify-end">
        <div className="inline-flex items-center gap-1 border border-brand-accent/40 bg-brand-accent/5 px-1.5 py-px rounded-xs">
          <span className="text-orange-700/70 font-mono text-[8px] tracking-widest uppercase">PORT B</span>
        </div>
      </div>

      {/* Bottom-left */}
      <div className="absolute bottom-6 left-6 w-10 h-10 border-l border-b border-brand-accent/40" />
      {/* Bottom-right */}
      <div className="absolute bottom-6 right-6 w-10 h-10 border-r border-b border-brand-accent/40" />

      {/* Main content */}
      <div className="relative max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        <motion.p
          custom={0}
          variants={variants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-orange-700 text-xs uppercase tracking-widest mb-6"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          Get Started Today
        </motion.p>

        <motion.h2
          custom={1}
          variants={variants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-4xl md:text-6xl font-bold text-text-primary leading-tight mb-6"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          Ready to Secure
          <br />
          <span
            style={{
              background:
                "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Property?
          </span>
        </motion.h2>

        <motion.p
          custom={2}
          variants={variants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-text-secondary text-lg max-w-xl leading-relaxed mb-10"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Get a no-obligation estimate from our team. We'll assess your property
          and recommend the right system for your needs and budget.
        </motion.p>

        <motion.div
          custom={3}
          variants={variants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            onClick={scrollToForm}
            className="group flex items-center gap-3 bg-brand-accent text-brand-base font-bold px-10 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Get a Free Estimate
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </button>
          <a
            href={siteConfig.phoneHref}
            className="text-text-secondary hover:text-text-primary text-sm tracking-wide transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            or call{" "}
            <span className="text-text-primary font-medium">{settings.phone}</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
