"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { ArrowRight, Clock, Tag, X } from "lucide-react";
import { type BlogPost } from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";

// All unique categories — used for the filter buttons

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function BlogClient({ posts }: { posts: BlogPost[] }) {
  const postsRef = useRef<HTMLElement>(null);
  const postsInView = useInView(postsRef, { once: true, amount: 0.05 });

  const categories = [
    "All",
    ...Array.from(new Set(posts.map((p) => p.category))),
  ];
  // Array.from(new Set(...)) removes duplicates — Set only stores unique values,
  // Array.from converts it back to an array we can map over.

  // activeCategory filters which posts are shown
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6); // for "Load More" pagination

  // When the user searches or changes category, reset back to showing 6
  React.useEffect(() => {
    setVisibleCount(6);
  }, [searchQuery, activeCategory]);

  // Derived state — filter posts based on activeCategory.
  // No useState needed — this recalculates every render automatically.
  // "derived state" means a value computed from existing state, not stored separately.
  const filteredPosts = posts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      const words = q.trim().split(/\s+/);
      const searchable = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
      return words.every((word) => searchable.includes(word));
    });

  // Only one post can be featured. If several are toggled on in Sanity, the
  // newest one wins and the rest are treated as regular posts.
  const postTime = (p: BlogPost) =>
    new Date(p.publishedAt ?? p._createdAt ?? 0).getTime();
  const featuredPost = posts
    .filter((p) => p.featured)
    .sort((a, b) => postTime(b) - postTime(a))[0];

  // Featured card only shows on the unfiltered, unsearched view
  const showFeatured =
    !!featuredPost && activeCategory === "All" && !searchQuery;

  // Grid excludes the featured post only while its card is showing
  const gridSource = showFeatured
    ? filteredPosts.filter((p) => p.slug !== featuredPost.slug)
    : filteredPosts;

  // Visible slice — only show up to visibleCount posts
  const gridPosts = gridSource.slice(0, visibleCount);

  // Whether there are more posts to show
  const hasMore = visibleCount < gridSource.length;

  const fadeUp: Variants = {
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

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
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

  return (
    <main className="bg-brand-base">
      {/* ── HERO BANNER ───────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,180,255,0.08) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="relative max-w-4xl mx-auto px-6 md:px-16 flex flex-col items-center text-center">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-brand-accent text-xs uppercase tracking-widest mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Security Insights
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            The {siteConfig.name}
            <br />
            <span
              style={{
                background:
                  "linear-gradient(90deg, var(--brand-accent) 0%, var(--brand-accent-light) 60%, var(--brand-accent-lighter) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Blog
            </span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-400 text-lg max-w-xl leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Practical security advice, buyer's guides, and industry insights
            from the team at {siteConfig.name}.
          </motion.p>
        </div>
      </section>

      {/* ── POSTS ─────────────────────────────────────────────────────────── */}
      <section
        ref={postsRef}
        className="relative bg-brand-surface py-24 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 md:px-16">
          <div className="relative mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full md:w-80 bg-brand-card border border-white/5 focus:border-brand-accent/50 px-4 py-3 rounded-sm text-white text-sm outline-none transition-colors duration-200 placeholder:text-slate-600"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors duration-200"
              >
                <X size={14} />
              </button>
            )}
          </div>
          {/* Category filter buttons */}
          <div className="flex flex-wrap gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-sm text-xs uppercase tracking-widest transition-all duration-200 ${
                  activeCategory === cat
                    ? "bg-brand-accent text-brand-base font-bold"
                    : "border border-white/10 text-slate-400 hover:border-brand-accent/30 hover:text-white"
                }`}
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Featured post — larger card, only shows when "All" is selected */}
          {showFeatured && (
            <motion.a
              href={`/blog/${featuredPost.slug}`}
              initial={{ opacity: 0, y: 20 }}
              animate={
                postsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }
              }
              transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
              }}
              className="group block p-8 md:p-10 rounded-sm border border-white/5 hover:border-brand-accent/20 bg-brand-card hover:bg-brand-card/80 transition-all duration-300 mb-6"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className="px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      Featured
                    </span>
                    <span
                      className="px-3 py-1 rounded-full border border-white/10 text-slate-500 text-xs uppercase tracking-widest"
                      style={{ fontFamily: "var(--font-rajdhani)" }}
                    >
                      {featuredPost.category}
                    </span>
                  </div>
                  <h2
                    className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-brand-accent transition-colors duration-200"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {featuredPost.title}
                  </h2>
                  <p
                    className="text-slate-400 leading-relaxed mb-4 max-w-2xl"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-slate-600 text-xs">
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {featuredPost.readTime}
                    </span>
                    <span>{featuredPost.date}</span>
                  </div>
                </div>
                <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full border border-white/10 group-hover:border-brand-accent/30 group-hover:text-brand-accent text-slate-500 transition-all duration-200">
                  <ArrowRight
                    size={18}
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  />
                </div>
              </div>
            </motion.a>
          )}

          {/* Regular post grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={postsInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {gridPosts.map((post) => (
              <motion.a
                key={post.slug}
                href={`/blog/${post.slug}`}
                variants={itemVariants}
                className="group flex flex-col p-6 rounded-sm border border-white/5 hover:border-brand-accent/20 bg-brand-card hover:bg-brand-card/80 transition-all duration-300"
              >
                {/* Category tag */}
                <div className="flex items-center gap-2 mb-4">
                  <Tag size={11} className="text-brand-accent/60" />
                  <span
                    className="text-brand-accent/80 text-xs uppercase tracking-widest"
                    style={{ fontFamily: "var(--font-rajdhani)" }}
                  >
                    {post.category}
                  </span>
                </div>

                <h3
                  className="text-lg font-bold text-white mb-3 group-hover:text-brand-accent transition-colors duration-200 leading-snug"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {post.title}
                </h3>

                <p
                  className="text-slate-400 text-sm leading-relaxed mb-6 flex-1"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  {post.excerpt}
                </p>

                {/* Meta row at the bottom */}
                <div className="flex items-center justify-between text-slate-600 text-xs mt-auto">
                  <span className="flex items-center gap-1.5">
                    <Clock size={11} /> {post.readTime}
                  </span>
                  <span>{post.date}</span>
                </div>
              </motion.a>
            ))}
          </motion.div>
          {/* Result count */}
          <p
            className="text-slate-600 text-xs text-center mt-8"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Showing {gridPosts.length + (showFeatured ? 1 : 0)} of{" "}
            {filteredPosts.length} articles
            {searchQuery && ` for "${searchQuery}"`}
          </p>

          {/* Load More button — only shows if there are more posts */}
          {hasMore && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setVisibleCount((prev) => prev + 6)}
                className="border border-white/10 hover:border-brand-accent/30 text-slate-400 hover:text-white px-8 py-3 rounded-sm text-xs uppercase tracking-widest transition-all duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Load More Articles
              </button>
            </div>
          )}

          {/* No results state */}
          {filteredPosts.length === 0 && (
            <div className="flex flex-col items-center py-16 text-center">
              <p
                className="text-slate-500 text-lg mb-2"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                No articles found
              </p>
              <p
                className="text-slate-600 text-sm"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                Try a different search term or category
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
