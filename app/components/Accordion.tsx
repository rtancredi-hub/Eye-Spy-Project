"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const answerTransition = {
  duration: 0.3,
  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
};

export function useAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const toggle = (i: number) => setOpenIndex((prev) => (prev === i ? null : i));
  return { openIndex, toggle };
}

/**
 * Shared question/answer row + expand behavior for the homepage FAQ and
 * pricing-page FAQ. `variant` reproduces each page's existing visual chrome
 * exactly — only the open/close state + animation logic is shared.
 */
export function AccordionRow({
  index,
  question,
  answer,
  isOpen,
  onToggle,
  variant = "faq",
  isLast = false,
}: {
  index: number;
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  variant?: "faq" | "pricing";
  isLast?: boolean;
}) {
  if (variant === "pricing") {
    return (
      <div className="border border-slate-200 rounded-sm overflow-hidden">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group hover:bg-brand-accent/5 transition-colors duration-200"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="shrink-0 font-mono text-[9px] tracking-widest uppercase text-orange-700/60 border border-brand-accent/30 px-1.5 py-0.5 rounded-sm">
              Q-{String(index + 1).padStart(2, "0")}
            </span>
            <span
              className="text-brand-base font-semibold text-sm leading-snug group-hover:text-orange-700 transition-colors duration-200"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              {question}
            </span>
          </div>
          <span className="shrink-0 text-orange-700/60">
            {isOpen ? <Minus size={16} /> : <Plus size={16} />}
          </span>
        </button>

        {isOpen && (
          <div className="px-5 pb-5 border-t border-slate-200">
            <p
              className="text-slate-600 text-sm leading-relaxed pt-4"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {answer}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`border-b ${isLast ? "border-transparent" : "border-slate-200"}`}>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 py-5 text-left group"
      >
        <span
          className="font-mono text-[9px] tracking-widest text-orange-700/60 uppercase shrink-0 hidden sm:block w-8"
          aria-hidden="true"
        >
          Q-{String(index + 1).padStart(2, "0")}
        </span>

        <span
          className={`flex-1 text-base font-medium transition-colors duration-200 pr-4 ${
            isOpen ? "text-text-primary" : "text-text-nav group-hover:text-text-primary"
          }`}
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          {question}
        </span>

        <span
          className={`shrink-0 flex items-center justify-center w-6 h-6 border transition-colors duration-200 ${
            isOpen
              ? "border-brand-accent/40 text-orange-700"
              : "border-slate-200 text-text-muted group-hover:border-brand-accent/25 group-hover:text-text-nav"
          }`}
          style={{ borderRadius: 0 }}
        >
          {isOpen ? <Minus size={12} /> : <Plus size={12} />}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={answerTransition}
            className="overflow-hidden"
          >
            <p
              className="text-text-secondary text-base leading-relaxed pb-5 pl-4 sm:pl-12 border-l-2 border-brand-accent/35"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
