"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  type Variants,
  AnimatePresence,
} from "framer-motion";
import { type Testimonial } from "../lib/types";

export default function Testimonials({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const [active, setActive] = useState<number>(0);

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
  };

  const quoteVariants: Variants = {
    initial: { opacity: 0, y: 16 },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    },
    exit: {
      opacity: 0,
      y: -16,
      transition: { duration: 0.3, ease: "easeIn" },
    },
  };

  return (
    <section
      ref={sectionRef}
      className="relative bg-page-alt py-24 overflow-hidden"
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

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        className="relative max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center"
      >
        {/* Cable label tag above eyebrow — P-touch aesthetic */}
        <div className="inline-flex items-center gap-1 mb-4 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs" aria-hidden="true">
          <span className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase">
            FEED-01 / CLIENT RESPONSE
          </span>
        </div>

        <p
          className="text-orange-700 text-xs uppercase tracking-widest mb-12"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          What Our Clients Say
        </p>

        <div className="relative w-full min-h-50 flex flex-col items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              variants={quoteVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center"
            >
              {/* RJ45 port symbol replaces the oversized quote glyph */}
              <div className="mb-4" aria-hidden="true">
                <svg width="36" height="26" viewBox="0 0 28 20" fill="none">
                  <rect x="1" y="1" width="26" height="18" rx="1"
                    stroke="#EF6B4D" strokeOpacity="0.55" strokeWidth="1"/>
                  {[4, 6.5, 9, 11.5, 14, 16.5, 19, 21.5].map((x, i) => (
                    <line key={i} x1={x} y1="5" x2={x} y2="15"
                      stroke="#EF6B4D" strokeOpacity="0.60" strokeWidth="0.8"/>
                  ))}
                </svg>
              </div>

              <p
                className="text-text-primary/80 text-xl md:text-2xl leading-relaxed max-w-2xl mb-8"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {testimonials[active].quote}
              </p>

              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: testimonials[active].rating }).map(
                  (_, i) => (
                    <span key={i} className="text-orange-700 text-lg">
                      ★
                    </span>
                  ),
                )}
              </div>

              <p
                className="text-text-primary font-semibold tracking-wide"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {testimonials[active].name}
              </p>
              <p
                className="text-text-muted text-sm mt-1"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {testimonials[active].location}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation dots — square junction connectors matching cable vocab */}
        <div className="flex items-center gap-3 mt-10">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`h-2 transition-all duration-300 ${
                i === active
                  ? "w-6 bg-brand-accent"
                  : "w-2 bg-slate-300 hover:bg-brand-accent/40"
              }`}
              style={{ borderRadius: 0 }}
              aria-label={`View testimonial ${i + 1}`}
            />
          ))}
        </div>

        {/* Prev/next — port-housing style: square, accent border */}
        <div className="flex items-center gap-4 mt-6">
          <button
            onClick={() =>
              setActive((prev) =>
                prev === 0 ? testimonials.length - 1 : prev - 1,
              )
            }
            className="w-9 h-9 border border-brand-accent/25 flex items-center justify-center text-text-secondary hover:border-brand-accent/50 hover:text-orange-700 transition-all duration-200"
            style={{ borderRadius: 0 }}
            aria-label="Previous testimonial"
          >
            ←
          </button>
          <button
            onClick={() =>
              setActive((prev) =>
                prev === testimonials.length - 1 ? 0 : prev + 1,
              )
            }
            className="w-9 h-9 border border-brand-accent/25 flex items-center justify-center text-text-secondary hover:border-brand-accent/50 hover:text-orange-700 transition-all duration-200"
            style={{ borderRadius: 0 }}
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </motion.div>
    </section>
  );
}
