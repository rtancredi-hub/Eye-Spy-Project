"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { type Service } from "@/app/lib/types";

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

export default function ServicesIndexClient({
  services,
}: {
  services: Service[];
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <main className="min-h-screen bg-page">
      {/* Hero */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(239,107,77,0.12) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-6xl mx-auto px-6 md:px-16 text-center">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-orange-700 text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            What We Offer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-brand-base"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Our{" "}
            <span
              style={{
                background:
                  "linear-gradient(90deg, #EF6B4D 0%, #f08060 60%, #f4a080 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Services
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 mt-6 text-lg max-w-2xl mx-auto"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Professional security system installation for homes and businesses.
            Everything we install is built to last.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative bg-page-alt py-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="max-w-6xl mx-auto px-6 md:px-16">
          {services.length === 0 ? (
            <p
              className="text-slate-600 text-center text-lg"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              Services coming soon.
            </p>
          ) : (
            <motion.div
              ref={gridRef}
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {services.map((service) => (
                <motion.div key={service.slug} variants={itemVariants}>
                  <div className="group p-8 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white hover:shadow-lg hover:shadow-slate-900/10 transition-all duration-300 h-full flex flex-col">
                    {service.icon && (
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-accent/10 text-2xl mb-5 group-hover:bg-brand-accent/20 transition-colors duration-300">
                        {service.icon}
                      </span>
                    )}
                    <h2
                      className="text-xl font-bold text-brand-base mb-3"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      {service.title}
                    </h2>
                    {service.shortDescription && (
                      <p
                        className="text-slate-600 text-base leading-relaxed flex-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {service.shortDescription}
                      </p>
                    )}
                    <Link
                      href={`/services/${service.slug}`}
                      className="inline-flex items-center gap-2 mt-6 text-orange-700 text-sm font-medium hover:gap-3 transition-all duration-200"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      Learn More <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-page">
        <div className="max-w-3xl mx-auto px-6 md:px-16 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-brand-base mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Not sure what you need?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-slate-600 text-lg mb-8"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Get in touch for a free security consultation and we&apos;ll
            recommend the right solution.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-accent text-brand-base font-semibold rounded-sm hover:bg-brand-accent/90 transition-colors duration-200"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Get a Free Consultation <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
