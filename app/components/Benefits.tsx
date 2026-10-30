"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import {
  ShieldCheck,
  Clock,
  Wrench,
  HeadphonesIcon,
  Star,
  Wifi,
  Lock,
  Eye,
  Zap,
  Phone,
} from "lucide-react";
import { type BenefitItem } from "../lib/types";

interface CablePath {
  d: string;
  termX: number;
  termY: number;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  shieldCheck: <ShieldCheck size={22} />,
  clock: <Clock size={22} />,
  wrench: <Wrench size={22} />,
  headphones: <HeadphonesIcon size={22} />,
  star: <Star size={22} />,
  wifi: <Wifi size={22} />,
  lock: <Lock size={22} />,
  eye: <Eye size={22} />,
  zap: <Zap size={22} />,
  phone: <Phone size={22} />,
};

const FALLBACK_BENEFITS: BenefitItem[] = [
  {
    iconName: "shieldCheck",
    title: "Secure & Reliable",
    description: "Your property is protected with professional-grade security systems.",
  },
  {
    iconName: "clock",
    title: "Fast Installation",
    description: "Most installations completed same or next day with minimal disruption.",
  },
  {
    iconName: "wrench",
    title: "Fully Supported",
    description: "We handle setup, configuration, and ongoing maintenance so you never have to.",
  },
  {
    iconName: "headphones",
    title: "24/7 Support",
    description: "Our dedicated team is always ready to assist you day or night.",
  },
];

interface BenefitsProps {
  benefits?: BenefitItem[];
  eyebrow?: string;
  heading?: string;
  subheading?: string;
}

export default function Benefits({
  benefits: propBenefits,
  eyebrow = "Why We're Different",
  heading = "Why choose Eye Spy?",
  subheading = "Everything you need from a security company — done right, the first time.",
}: BenefitsProps) {
  const benefits = propBenefits?.length ? propBenefits : FALLBACK_BENEFITS;

  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cablePaths, setCablePaths] = useState<CablePath[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  useEffect(() => {
    if (!isInView || !sectionRef.current) return;

    const computePaths = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const paths = cardRefs.current.slice(0, benefits.length).map((card, i) => {
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        const relTop   = rect.top   - sectionRect.top;
        const relLeft  = rect.left  - sectionRect.left;
        const relRight = rect.right - sectionRect.left;
        const cardMidY = relTop + rect.height / 2;
        const isLeft   = i % 2 === 0;
        const entryY   = cardMidY - 20;

        if (isLeft) {
          return {
            d: `M 0,${entryY} L ${relLeft - 20},${entryY} L ${relLeft - 20},${cardMidY} L ${relLeft},${cardMidY}`,
            termX: relLeft,
            termY: cardMidY,
          };
        } else {
          const W = sectionRect.width;
          return {
            d: `M ${W},${entryY} L ${relRight + 20},${entryY} L ${relRight + 20},${cardMidY} L ${relRight},${cardMidY}`,
            termX: relRight,
            termY: cardMidY,
          };
        }
      });
      setCablePaths(paths.filter(Boolean) as CablePath[]);
    };

    computePaths();
    window.addEventListener("resize", computePaths);
    return () => window.removeEventListener("resize", computePaths);
  }, [isInView, benefits.length]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: prefersReducedMotion ? 0.1 : 1.3,
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

  const cableVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i: number) => ({
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: {
          duration: prefersReducedMotion ? 0 : 0.7,
          delay: i * 0.15,
          ease: "easeInOut",
        },
        opacity: { duration: 0.01, delay: i * 0.15 },
      },
    }),
  };

  const dotVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.2,
        delay: prefersReducedMotion ? 0 : i * 0.15 + 0.7,
      },
    }),
  };

  // Grid cols depend on count — Tailwind requires static strings
  const gridClass =
    benefits.length <= 2
      ? "grid-cols-1 sm:grid-cols-2"
      : benefits.length === 3
      ? "grid-cols-1 sm:grid-cols-3"
      : "grid-cols-1 sm:grid-cols-2";

  return (
    <section
      id="benefits"
      ref={sectionRef}
      className="scroll-mt-20 relative bg-page-alt py-16 md:py-24 overflow-hidden"
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

      {/* Cable SVG overlay — desktop only, purely decorative */}
      {cablePaths.length > 0 && (
        <div
          className="hidden md:block absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            width="100%"
            height="100%"
            style={{ position: "absolute", inset: 0, overflow: "visible" }}
          >
            {cablePaths.map((cable, i) => (
              <React.Fragment key={i}>
                <motion.path
                  d={cable.d}
                  stroke="#EF6B4D"
                  strokeOpacity="0.12"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="square"
                  variants={cableVariants}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                />
                <motion.path
                  d={cable.d}
                  stroke="#EF6B4D"
                  strokeOpacity="0.40"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="square"
                  variants={cableVariants}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                />
                <motion.circle
                  cx={cable.termX}
                  cy={cable.termY}
                  r="3"
                  fill="#EF6B4D"
                  fillOpacity="0.8"
                  variants={dotVariants}
                  custom={i}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                />
              </React.Fragment>
            ))}
          </svg>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        <p
          className="text-orange-700 text-xs uppercase tracking-widest mb-4"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          {eyebrow}
        </p>
        <h2
          className="text-4xl md:text-6xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          {heading}
        </h2>
        <p
          className="text-text-secondary mt-4 text-lg max-w-2xl"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {subheading}
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className={`grid ${gridClass} gap-4 md:gap-6 mt-12 w-full`}
        >
          {benefits.map((benefit, index) => (
            <motion.div key={benefit.title} variants={itemVariants}>
              <div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group p-6 md:p-8 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300 h-full text-left"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent/10 text-orange-700 mb-4 group-hover:bg-brand-accent/20 transition-colors duration-300">
                  {ICON_MAP[benefit.iconName] ?? <ShieldCheck size={22} />}
                </span>
                <h3
                  className="text-xl font-bold text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {benefit.title}
                </h3>
                <p
                  className="text-text-secondary text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {benefit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
