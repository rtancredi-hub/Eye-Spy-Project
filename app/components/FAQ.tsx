"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { type FaqItem } from "../lib/types";
import { AccordionRow, useAccordion } from "./Accordion";

export default function FAQ({ items }: { items: FaqItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  const { openIndex, toggle } = useAccordion();

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.07, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
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
      <div className="max-w-3xl mx-auto px-6 md:px-16">
        {/* Heading */}
        <div className="mb-14 flex flex-col items-center text-center">
          {/* Cable label tag */}
          <div className="inline-flex items-center gap-1 mb-4 border border-brand-accent/40 bg-brand-accent/5 px-2 py-0.5 rounded-xs" aria-hidden="true">
            <span className="text-orange-700/80 font-mono text-[10px] tracking-widest uppercase">
              COMMON QUESTIONS
            </span>
          </div>
          <h2
            className="text-4xl md:text-5xl font-bold text-text-primary"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Frequently Asked
          </h2>
        </div>

        {/* FAQ list */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col"
        >
          {items.map((faq, i) => (
            <motion.div key={faq.question} variants={itemVariants}>
              <AccordionRow
                index={i}
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === i}
                onToggle={() => toggle(i)}
                isLast={i === items.length - 1}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
