"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { type Testimonial } from "../../lib/types";

// Compact, click/swipe-through review card for /lp/* pages — sits under the
// estimate form. One review at a time; long quotes clamp with "Read more".
export default function LPTestimonialCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStartX = useRef<number | null>(null);

  if (testimonials.length === 0) return null;

  const count = testimonials.length;
  const t = testimonials[active];
  const isLong = t.quote.length > 220;

  const go = (next: number) => {
    setActive((next + count) % count);
    setExpanded(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(delta) > 40) go(active + (delta < 0 ? 1 : -1));
    touchStartX.current = null;
  };

  return (
    <div
      className="bg-[#0c1a2e] border border-white/10 rounded-sm p-6"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Customer reviews"
    >
      <div className="flex items-center justify-between mb-4">
        <p
          className="text-brand-accent text-xs uppercase tracking-widest"
          style={{ fontFamily: "var(--font-rajdhani)" }}
        >
          What Customers Say
        </p>
        <div className="flex gap-1">
          {[...Array(t.rating || 5)].map((_, i) => (
            <Star key={i} size={12} className="text-brand-accent fill-brand-accent" />
          ))}
        </div>
      </div>

      <div className="min-h-[9.5rem]" aria-live="polite">
        <p
          className={`text-slate-200 text-sm leading-relaxed ${isLong && !expanded ? "line-clamp-4" : ""}`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          &ldquo;{t.quote}&rdquo;
        </p>
        {isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-1 text-brand-accent text-xs hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        <div className="mt-4">
          <p
            className="text-white text-sm font-bold"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {t.name}
          </p>
          <p
            className="text-slate-400 text-xs"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {t.location}
          </p>
        </div>
      </div>

      {count > 1 && (
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/10">
          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`View review ${i + 1}`}
                aria-current={i === active}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === active ? "w-6 bg-brand-accent" : "w-2 bg-white/25 hover:bg-brand-accent/50"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => go(active - 1)}
              aria-label="Previous review"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white hover:text-brand-accent hover:border-brand-accent/50 transition-colors duration-200"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => go(active + 1)}
              aria-label="Next review"
              className="flex items-center justify-center w-9 h-9 rounded-full border border-white/15 text-white hover:text-brand-accent hover:border-brand-accent/50 transition-colors duration-200"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
