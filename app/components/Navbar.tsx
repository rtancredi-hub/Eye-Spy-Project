"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";
import { siteConfig } from "../config/site";
import { type SiteSettings } from "../lib/types";
import Image from "next/image";
import Link from "next/link";

export default function Navbar({ settings }: { settings: SiteSettings }) {
  // ─── SCROLL STATE ──────────────────────────────────────────────────────────
  // scrolled tracks whether the user has scrolled past 80px.
  // When true we add a solid background to the navbar.
  // When false (at the top) it stays transparent over the Hero.
  const [scrolled, setScrolled] = useState(false);

  // mobileOpen tracks whether the mobile menu is open or closed.
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // handleScroll runs every time the user scrolls.
    // window.scrollY is the current vertical scroll position in pixels.
    // We set scrolled to true once they've scrolled more than 80px.
    const handleScroll = () => setScrolled(window.scrollY > 80);

    window.addEventListener("scroll", handleScroll);

    // Cleanup — remove the listener when the component unmounts
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToForm = () => {
    setMobileOpen(false);
    document
      .getElementById("estimate-form")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* ── NAVBAR ──────────────────────────────────────────────────────────
          "fixed top-0 left-0 right-0" — sticks to the top of the viewport
          as the user scrolls. "fixed" is different from "absolute":
            absolute — positioned relative to nearest parent
            fixed — positioned relative to the browser viewport, always visible
          z-50 keeps it above all page content.

          The background and border change based on the scrolled state.
          Ternary applies different classes depending on scroll position —
          transparent at top, solid dark when scrolled.
      */}
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`theme-dark fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[#0f1d33]/95 backdrop-blur-sm border-b border-brand-accent/40 ${
          scrolled ? "shadow-lg shadow-black/40" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-16 flex items-center justify-between h-20 md:h-24">
          {/* Logo */}
          <Link href="/" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="flex items-center gap-2">
            <Image
              src={siteConfig.brand.logo}
              alt={siteConfig.brand.logoAlt}
              width={260}
              height={80}
              className="h-20 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            {siteConfig.navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-text-nav hover:text-text-primary text-sm uppercase tracking-widest transition-colors duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA — hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <a
              href={siteConfig.phoneHref}
              className="text-text-nav hover:text-text-primary text-sm transition-colors duration-200"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {settings.phone}
            </a>
            <button
              onClick={scrollToForm}
              className="group flex items-center gap-2 bg-brand-accent text-brand-base font-bold px-5 py-2.5 rounded-sm text-xs uppercase tracking-widest hover:bg-white transition-colors duration-200"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Free Estimate
              <ArrowRight
                size={13}
                className="group-hover:translate-x-0.5 transition-transform duration-200"
              />
            </button>
          </div>

          {/* Mobile menu button — only visible on mobile */}
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="md:hidden text-text-nav hover:text-text-primary transition-colors duration-200"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {/* Show X when open, Menu icon when closed */}
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.header>

      {/* ── MOBILE MENU ───────────────────────────────────────────────────────
          AnimatePresence allows the menu to animate out when closed.
          Rendered outside the header so it can overlay the full screen.
          "fixed inset-0 z-40" covers the entire viewport.
          pt-20 pushes content below the navbar height.
      */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="theme-dark fixed inset-0 z-40 bg-brand-base/98 backdrop-blur-sm flex flex-col pt-20 px-6 md:hidden"
          >
            {/* Mobile nav links */}
            <nav className="flex flex-col gap-1 mt-8">
              {siteConfig.navLinks.map((link, i) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-text-nav hover:text-text-primary text-2xl font-bold py-3 border-b border-white/5 transition-colors duration-200"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            {/* Mobile CTA area */}
            <div className="mt-10 flex flex-col gap-4">
              <button
                onClick={scrollToForm}
                className="group flex items-center justify-center gap-2 bg-brand-accent text-brand-base font-bold px-6 py-4 rounded-sm text-sm uppercase tracking-widest hover:bg-white transition-colors duration-200"
                style={{ fontFamily: "var(--font-rajdhani)" }}
              >
                Get a Free Estimate
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform duration-200"
                />
              </button>
              <a
                href={siteConfig.phoneHref}
                className="text-center text-text-nav hover:text-text-primary text-sm transition-colors duration-200"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                or call {settings.phone}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
