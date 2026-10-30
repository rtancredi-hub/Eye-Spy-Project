"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import Link from "next/link";
import { type Service } from "@/app/lib/types";

interface CablePath {
  d: string;
  termX: number;
  termY: number;
}

export default function Services({ services }: { services: Service[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [cablePaths, setCablePaths] = useState<CablePath[]>([]);
  const prefersReducedMotion = useReducedMotion();

  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  // Compute cable paths from card positions — same pattern as Benefits.tsx
  useEffect(() => {
    if (!isInView || !sectionRef.current) return;

    const computePaths = () => {
      if (!sectionRef.current) return;
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const firstRect = cardRefs.current[0]?.getBoundingClientRect();
      const colCount = firstRect
        ? cardRefs.current.filter(
            (c) => c && Math.abs(c.getBoundingClientRect().top - firstRect.top) < 5
          ).length
        : 1;

      const paths = cardRefs.current.map((card, i) => {
        if (!card) return null;
        const rect = card.getBoundingClientRect();
        const relTop   = rect.top   - sectionRect.top;
        const relLeft  = rect.left  - sectionRect.left;
        const relRight = rect.right - sectionRect.left;
        const cardMidY = relTop + rect.height / 2;

        const col = i % colCount;
        const isLeftEdge  = col === 0;
        const isRightEdge = col === colCount - 1;
        if (!isLeftEdge && !isRightEdge) return null;

        const entryY = cardMidY - 20;

        if (isLeftEdge) {
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
    return () => {
      window.removeEventListener("resize", computePaths);
    };
  }, [isInView]);

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: prefersReducedMotion ? 0.1 : 1.2,
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

  // Port label identifier per service card
  const portLabel = (i: number) => `SVC-${String(i + 1).padStart(2, "0")}`;

  return (
    <section
      id="services"
      ref={sectionRef}
      className="scroll-mt-20 relative bg-page-alt py-24 overflow-hidden"
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
      {/* Cable SVG overlay — desktop only, decorative */}
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
                  stroke="#EF6B4D" strokeOpacity="0.12" strokeWidth="4"
                  fill="none" strokeLinecap="square"
                  variants={cableVariants} custom={i}
                  initial="hidden" animate={isInView ? "visible" : "hidden"}
                />
                <motion.path
                  d={cable.d}
                  stroke="#EF6B4D" strokeOpacity="0.40" strokeWidth="1.5"
                  fill="none" strokeLinecap="square"
                  variants={cableVariants} custom={i}
                  initial="hidden" animate={isInView ? "visible" : "hidden"}
                />
                <motion.circle
                  cx={cable.termX} cy={cable.termY} r="3"
                  fill="#EF6B4D" fillOpacity="0.8"
                  variants={dotVariants} custom={i}
                  initial="hidden" animate={isInView ? "visible" : "hidden"}
                />
              </React.Fragment>
            ))}
          </svg>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
        {/* Section header with cable label tag */}
        <div className="inline-flex items-center gap-1 mb-4 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs" aria-hidden="true">
          <span className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase">
            WHAT WE OFFER
          </span>
        </div>

        <h2
          className="text-4xl md:text-6xl font-bold text-text-primary"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          Our Services
        </h2>
        <p
          className="text-text-secondary mt-4 text-lg max-w-2xl"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Everything we install, built to last.
        </p>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12"
        >
          {services.map((service, index) => (
            <motion.div key={service._id} variants={itemVariants}>
              <div
                ref={(el) => { cardRefs.current[index] = el; }}
                className="group p-8 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300 h-full
                           border-l-2 border-l-brand-accent/20 md:border-l md:border-l-white/5 md:hover:border-l-brand-accent/20"
              >
                {/* RJ45 port symbol + port identifier */}
                <div className="flex items-center gap-2 mb-4">
                  <svg width="28" height="20" viewBox="0 0 28 20" fill="none" aria-hidden="true">
                    <rect x="1" y="1" width="26" height="18" rx="1"
                      stroke="#EF6B4D" strokeOpacity="0.6" strokeWidth="1"/>
                    {[4, 6.5, 9, 11.5, 14, 16.5, 19, 21.5].map((x, i) => (
                      <line key={i} x1={x} y1="5" x2={x} y2="15"
                        stroke="#EF6B4D" strokeOpacity="0.7" strokeWidth="0.8"/>
                    ))}
                  </svg>
                  <span className="font-mono text-[9px] tracking-widest text-orange-700/70 uppercase">
                    {portLabel(index)}
                  </span>
                </div>

                <Link
                  href={`/services/${service.slug}`}
                  className="inline-block text-orange-700 text-xs uppercase tracking-widest bg-brand-accent/10 px-2.5 py-0.5 rounded-sm mb-4 hover:underline hover:opacity-80 transition-opacity duration-200"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {service.title}
                </Link>
                {service.icon && (
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-brand-accent/10 text-orange-700 mb-4 group-hover:bg-brand-accent/20 transition-colors duration-300 text-xl">
                    {service.icon}
                  </span>
                )}
                <h3
                  className="text-xl font-bold text-text-primary mb-2"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {service.title}
                </h3>
                <p
                  className="text-text-secondary text-base leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {service.shortDescription}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
