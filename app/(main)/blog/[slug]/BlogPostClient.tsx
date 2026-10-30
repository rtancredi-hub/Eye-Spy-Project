"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Tag, ArrowRight } from "lucide-react";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { type BlogPost } from "@/app/lib/types";
import { urlFor } from "@/app/lib/sanity";

const portableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <span className="block relative w-full aspect-video my-6 rounded-sm overflow-hidden">
          <Image
            src={urlFor(value).width(1200).auto("format").url()}
            alt={value.alt || ""}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
          />
        </span>
      );
    },
  },
};

export default function BlogPostClient({
  post,
  relatedPosts,
}: {
  post: BlogPost;
  relatedPosts: BlogPost[];
}) {
  return (
    <main className="bg-page">
      {/* ── ARTICLE HEADER ────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,107,77,0.07) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="relative max-w-3xl mx-auto px-6 md:px-16">
          {/* Back link */}
          <motion.a
            href="/blog"
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-base text-sm mb-10 transition-colors duration-200"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <ArrowLeft size={14} /> Back to Blog
          </motion.a>

          {/* Category + meta */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap items-center gap-4 mb-6"
          >
            <span
              className="flex items-center gap-2 text-orange-700 text-xs uppercase tracking-widest"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              <Tag size={11} /> {post.category}
            </span>
            <span
              className="flex items-center gap-1.5 text-slate-500 text-xs"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              <Clock size={11} /> {post.readTime}
            </span>
            <span
              className="text-slate-500 text-xs"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {post.date}
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
            }}
            className="text-4xl md:text-5xl font-bold text-brand-base leading-tight mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            {post.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-slate-600 text-lg leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {post.excerpt}
          </motion.p>
        </div>
      </section>

      {/* ── ARTICLE BODY ──────────────────────────────────────────────────── */}
      <section className="relative bg-page-alt py-16 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          // prose styles — applied inline since we're not using Tailwind Typography plugin
          className="max-w-3xl mx-auto px-6 md:px-16"
          style={{
            fontFamily: "var(--font-dm-sans)",
            color: "#334155", // slate-700
            lineHeight: "1.8",
            fontSize: "1rem",
          }}
        >
          {/* Override heading styles inside article body */}
          <style>{`
            .article-body h2 {
              font-family: var(--font-rajdhani);
              font-size: 1.75rem;
              font-weight: 700;
              color: #050d1a;
              margin-top: 2rem;
              margin-bottom: 0.75rem;
            }
            .article-body p {
              margin-bottom: 0;
            }
            .article-body a {
              color: #c2410c;
              text-decoration: underline;
            }
          `}</style>
          <div className="article-body">
            {post.content && (
              <PortableText
                value={post.content}
                components={portableTextComponents}
              />
            )}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="relative bg-page py-20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute top-6 left-6 w-8 h-8 border-l border-t border-brand-accent/20" />
        <div className="absolute top-6 right-6 w-8 h-8 border-r border-t border-brand-accent/20" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-l border-b border-brand-accent/20" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-r border-b border-brand-accent/20" />

        <div className="max-w-2xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <p
            className="text-orange-700 text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Ready to Take Action?
          </p>
          <h2
            className="text-3xl md:text-4xl font-bold text-brand-base mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Get a Free Security Assessment
          </h2>
          <p
            className="text-slate-600 mb-8 leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Let our team walk your property and recommend exactly what you need
            — no pressure, no upsell.
          </p>
          <a
            href="/#estimate-form"
            className="group flex items-center gap-3 bg-brand-accent text-brand-base font-bold px-8 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-brand-base hover:text-white transition-colors duration-200"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Request Free Estimate
            <ArrowRight
              size={16}
              className="group-hover:translate-x-1 transition-transform duration-200"
            />
          </a>
        </div>
      </section>

      {/* ── RELATED POSTS ─────────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="relative bg-page-alt py-20 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
          <div className="max-w-6xl mx-auto px-6 md:px-16">
            <h2
              className="text-2xl font-bold text-brand-base mb-8"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Related Posts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <a
                  key={related.slug}
                  href={`/blog/${related.slug}`}
                  className="group p-6 rounded-sm border border-slate-200 hover:border-brand-accent/20 bg-white transition-all duration-300"
                >
                  <span
                    className="text-orange-700/70 text-xs uppercase tracking-widest mb-3 block"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {related.category}
                  </span>
                  <h3
                    className="text-lg font-bold text-brand-base group-hover:text-orange-700 transition-colors duration-200 mb-2"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {related.title}
                  </h3>
                  <p
                    className="text-slate-600 text-sm"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {related.readTime} · {related.date}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
