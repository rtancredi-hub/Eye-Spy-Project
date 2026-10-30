"use client";

import React from "react";
import { Phone, Mail, MapPin, Facebook, Instagram, Star } from "lucide-react";
import { siteConfig } from "../config/site";
import { type SiteSettings } from "../lib/types";
import Image from "next/image";
import Link from "next/link";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const currentYear = new Date().getFullYear();
  // new Date() creates a JavaScript Date object for right now.
  // .getFullYear() extracts the 4-digit year.
  // Storing it in a variable means the copyright year updates automatically
  // every year without anyone touching the code.

  return (
    <footer className="theme-dark relative bg-brand-deep overflow-hidden">
      {/* Top divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />

      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-64 opacity-10"
        style={{
          background: "radial-gradient(ellipse, var(--brand-accent) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />

      {/* ── MAIN FOOTER CONTENT ─────────────────────────────────────────── */}
      <div className="relative max-w-7xl mx-auto px-6 md:px-16 py-16">
        {/* Four column grid on desktop, single column on mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* ── COLUMN 1: Brand ─────────────────────────────────────────── */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src={siteConfig.brand.logo}
                alt={siteConfig.brand.logoAlt}
                width={210}
                height={64}
                className="h-16 w-auto object-contain"
                priority
              />
            </Link>
            <p
              className="text-text-muted text-sm leading-relaxed mb-6"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {settings.description}
            </p>

            {/* Social links */}
            <div className="flex items-center gap-3">
              <a
                href={settings.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                // target="_blank" opens in a new tab.
                // rel="noopener noreferrer" is a security best practice —
                // prevents the new tab from accessing the original page via window.opener.
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-accent hover:border-brand-accent/30 transition-all duration-200"
                aria-label="Facebook"
              >
                <Facebook size={14} />
              </a>
              <a
                href={settings.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-accent hover:border-brand-accent/30 transition-all duration-200"
                aria-label="Instagram"
              >
                <Instagram size={14} />
              </a>
              <a
                href={settings.social.google}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-text-muted hover:text-brand-accent hover:border-brand-accent/30 transition-all duration-200"
                aria-label="Google Reviews"
              >
                <Star size={14} />
              </a>
            </div>
          </div>

          {/* ── COLUMN 2: Navigation ────────────────────────────────────── */}
          <div>
            <h3
              className="text-text-primary text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Navigation
            </h3>
            <ul className="flex flex-col gap-3">
              {siteConfig.navLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 3: Services ──────────────────────────────────────── */}
          <div>
            <h3
              className="text-text-primary text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Services
            </h3>
            <ul className="flex flex-col gap-3">
              {siteConfig.services.map((service) => (
                <li key={service.value}>
                  <Link
                    href="/#services"
                    className="text-text-muted hover:text-text-primary text-sm transition-colors duration-200"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {service.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── COLUMN 4: Contact ───────────────────────────────────────── */}
          <div>
            <h3
              className="text-text-primary text-xs uppercase tracking-widest mb-6"
              style={{ fontFamily: "var(--font-rajdhani)" }}
            >
              Contact
            </h3>
            <ul className="flex flex-col gap-4">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-start gap-3 text-text-muted hover:text-text-primary transition-colors duration-200 group"
                >
                  <Phone
                    size={14}
                    className="mt-0.5 shrink-0 text-brand-accent/50 group-hover:text-brand-accent transition-colors duration-200"
                  />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {settings.phone}
                  </span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.emailHref}
                  className="flex items-start gap-3 text-text-muted hover:text-text-primary transition-colors duration-200 group"
                >
                  <Mail
                    size={14}
                    className="mt-0.5 shrink-0 text-brand-accent/50 group-hover:text-brand-accent transition-colors duration-200"
                  />
                  <span
                    className="text-sm"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {settings.email}
                  </span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-text-muted">
                  <MapPin
                    size={14}
                    className="mt-0.5 shrink-0 text-brand-accent/50"
                  />
                  <span
                    className="text-sm leading-relaxed"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    {settings.address}
                  </span>
                </div>
              </li>
              <li className="pt-2">
                <div
                  className="text-text-subtle text-xs leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  <p>{settings.hours.weekdays}</p>
                  <p>{settings.hours.saturday}</p>
                  <p>{settings.hours.sunday}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ──────────────────────────────────────────────────── */}
      <div className="relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-text-subtle text-xs"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            © {currentYear} {settings.siteName}. All rights reserved.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p
              className="text-text-subtle text-xs"
              style={{ fontFamily: "var(--font-dm-sans)" }}
            >
              {settings.serviceArea}
            </p>

            <span className="inline-flex items-center gap-2 border border-brand-accent/25 bg-brand-accent/5 px-2.5 py-1 rounded-xs">
              {/* Connector LED — same pulse language as the hero's "Licensed & Insured" badge */}
              <span className="relative flex items-center justify-center w-1.5 h-1.5 shrink-0" aria-hidden>
                <span className="absolute inset-0 rounded-full bg-brand-accent motion-safe:animate-ping opacity-60" />
                <span className="relative w-1.5 h-1.5 rounded-full bg-brand-accent" />
              </span>
              <span
                className="text-[10px] tracking-widest uppercase text-text-subtle"
                style={{ fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace" }}
              >
                Powered by <span className="text-brand-accent/90">Leonis Studios</span>
              </span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
