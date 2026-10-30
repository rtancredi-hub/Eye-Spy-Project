"use client";

import React, { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";
import { type SiteSettings } from "../lib/types";

const lastUpdated = "March 2026";

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function PrivacyClient({ settings }: { settings: SiteSettings }) {
  // sections built inside the component so they can reference settings
  const sections = [
    {
      title: "Information We Collect",
      content: `When you submit a form on our website, we collect the following personal information:

• Full name
• Phone number
• Email address
• Property address
• Service type requested
• Any additional details you voluntarily provide

We do not collect payment information through this website. We do not use cookies for tracking or advertising purposes beyond basic website analytics.`,
    },
    {
      title: "How We Use Your Information",
      content: `The information you provide is used solely for the following purposes:

• To respond to your estimate or contact request
• To schedule a property survey or installation
• To communicate with you about your project
• To send service-related follow-up communications

We do not use your information for marketing purposes without your explicit consent. We do not sell, rent, lease, or otherwise transfer your personal information to third parties for their marketing purposes.`,
    },
    {
      title: "How We Protect Your Information",
      content: `In accordance with New York's SHIELD Act (Stop Hacks and Improve Electronic Data Security Act), ${settings.siteName} implements reasonable administrative, technical, and physical safeguards to protect the personal information we collect. These safeguards include:

• Secure data transmission using SSL/TLS encryption
• Limited access to personal data to authorized personnel only
• Regular review of data collection and storage practices
• Prompt notification in the event of a data breach as required by law

We retain your personal information only as long as necessary to fulfill the purposes described in this policy or as required by applicable law.`,
    },
    {
      title: "Third-Party Services",
      content: `Our website may use third-party services to operate and improve our online presence. These may include:

• Website hosting providers
• Analytics services (such as Google Analytics) to understand site traffic
• Form submission services to receive and store your requests

These third-party services have their own privacy policies governing the use of your information. We encourage you to review the privacy policies of any third-party services you interact with through our site.

We do not share your personal information with third parties except as necessary to fulfill your service request or as required by law.`,
    },
    {
      title: "Your Rights Under New York Law",
      content: `Under New York law, including the SHIELD Act, you have the following rights regarding your personal information:

• The right to know what personal information we have collected about you
• The right to request correction of inaccurate personal information
• The right to request deletion of your personal information, subject to certain exceptions
• The right to be notified in the event of a data breach that affects your personal information

To exercise any of these rights, please contact us using the information provided at the bottom of this policy.`,
    },
    {
      title: "Children's Privacy",
      content: `Our website and services are not directed at children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected information from a child under 13, please contact us immediately and we will take prompt steps to delete that information.`,
    },
    {
      title: "Links to Other Websites",
      content: `Our website may contain links to third-party websites. These links are provided for your convenience and do not signify our endorsement of those websites. We have no responsibility for the content or privacy practices of linked websites. We encourage you to review the privacy policy of any website you visit.`,
    },
    {
      title: "Changes to This Policy",
      content: `We may update this Privacy Policy from time to time to reflect changes in our practices or applicable law. When we make changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically. Your continued use of our website after any changes constitutes your acceptance of the updated policy.`,
    },
    {
      title: "Contact Us",
      content: `If you have questions about this Privacy Policy, wish to exercise your rights, or want to report a privacy concern, please contact us:

${settings.siteName}
${settings.address}
${settings.email}
${settings.phone}

We will respond to all privacy-related inquiries within 30 days.`,
    },
  ];

  const contentRef = useRef<HTMLElement>(null);
  const contentInView = useInView(contentRef, { once: true, amount: 0.05 });

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      },
    }),
  };

  const containerVariants: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
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
    <main className="bg-page">
      {/* ── HEADER ──────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-16 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(239,107,77,0.06) 0%, transparent 70%)",
          }}
          aria-hidden
        />
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <div className="relative max-w-3xl mx-auto px-6 md:px-16">
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-orange-700 text-xs uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Legal
          </motion.p>
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-6xl font-bold text-brand-base mb-4"
            style={{ fontFamily: "var(--font-rajdhani)" }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-600 text-sm"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Last updated: {lastUpdated}
          </motion.p>
          <motion.p
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-slate-600 mt-4 leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {settings.siteName} ("we", "us", or "our") is committed to protecting
            your personal information. This Privacy Policy explains how we
            collect, use, and safeguard information you provide when using our
            website or requesting our services.
          </motion.p>
        </div>
      </section>

      {/* ── POLICY SECTIONS ─────────────────────────────────────────────── */}
      <section
        ref={contentRef}
        className="relative bg-page-alt py-16 overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={contentInView ? "visible" : "hidden"}
          className="max-w-3xl mx-auto px-6 md:px-16 flex flex-col gap-10"
        >
          {sections.map((section, i) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className="flex flex-col gap-4"
            >
              {/* Section number + title */}
              <div className="flex items-start gap-4">
                <span
                  className="text-orange-700/40 text-xs font-bold mt-1 shrink-0"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2
                  className="text-xl font-bold text-brand-base"
                  style={{ fontFamily: "var(--font-rajdhani)" }}
                >
                  {section.title}
                </h2>
              </div>

              {/* Divider */}
              <div className="h-px bg-linear-to-r from-brand-accent/10 to-transparent" />

              {/* Content — whitespace-pre-line preserves line breaks in the strings */}
              <p
                className="text-slate-600 leading-relaxed whitespace-pre-line"
                style={{ fontFamily: "var(--font-dm-sans)" }}
              >
                {section.content}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── DISCLAIMER ──────────────────────────────────────────────────── */}
      <section className="relative bg-page py-12 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-brand-accent/15 to-transparent" />
        <div className="max-w-3xl mx-auto px-6 md:px-16">
          <p
            className="text-slate-500 text-xs leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <strong className="text-slate-600">Legal Disclaimer:</strong> This
            Privacy Policy is provided for informational purposes and represents
            our good-faith effort to comply with applicable New York state and
            federal privacy laws including the NY SHIELD Act. This policy does
            not constitute legal advice. {settings.siteName} recommends consulting
            with a qualified attorney to ensure full legal compliance for your
            specific business circumstances.
          </p>
        </div>
      </section>
    </main>
  );
}
