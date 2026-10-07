import type { Service } from "../lib/types";

// ─── FALLBACK SERVICES ────────────────────────────────────────────────────────
// Used ONLY when Sanity returns an empty array (e.g. no servicePage documents yet).
// Sanity servicePage documents are the primary source of truth.
// Slugs here must match the slugs used in Sanity exactly.
export const FALLBACK_SERVICES: Service[] = [
  { _id: "fallback-cameras",      title: "CCTV & Camera Systems",               slug: "cameras",      order: 1 },
  { _id: "fallback-alarms",       title: "Alarm Systems",                        slug: "alarms",       order: 2 },
  { _id: "fallback-access",       title: "Access Control",                       slug: "access",       order: 3 },
  { _id: "fallback-cabling",      title: "Data & Voice Cabling Infrastructure",  slug: "cabling",      order: 4 },
  { _id: "fallback-consultation", title: "Security Consultation",                slug: "consultation", order: 5 },
  { _id: "fallback-other",        title: "Other / Not Sure",                     slug: "other",        order: 6 },
];

// ─── SITE CONFIG ─────────────────────────────────────────────────────────────
// This is the single source of truth for all client-facing content.
// When anything changes — phone number, address, services, social links —
// update it HERE and it automatically reflects everywhere on the site.
// Never hardcode this information directly in components.

export const siteConfig = {
  brand: {
    logo: "/logopng.png",
    logoAlt: "EyeSpy Cabling",
    accent: "#EF6B4D",
    accentHover: "#ffffff",
  },
  // ─── BRAND ───────────────────────────────────────────────────────────────
  name: "EyeSpy Cabling",
  tagline: "Security Systems Built to Protect.",
  description:
    "Licensed security system installation for homes and businesses. Cameras, alarms, access control. Get a free estimate today.",

  // ─── CONTACT ─────────────────────────────────────────────────────────────
  phone: "(914) 882-5642",
  phoneHref: "tel:+19148825642", // used in href attributes
  email: "services@eyespycabling.com",
  emailHref: "mailto:services@eyespycabling.com",

  // ─── LOCATION ────────────────────────────────────────────────────────────
  address: "65 Brushwood Drive, Shirley, NY 11967",
  // Structured address fields — used by JSON-LD schemas (PostalAddress).
  // Keep these in sync with the display address above.
  addressStreet: "65 Brushwood Drive",
  addressCity: "Shirley",
  addressRegion: "NY",
  addressPostal: "11967",
  serviceArea: "Serving the greater [City] area within 50 miles",

  // ─── BUSINESS HOURS ──────────────────────────────────────────────────────
  hours: {
    weekdays: "Mon – Fri: 8am – 6pm",
    saturday: "Sat: 9am – 4pm",
    sunday: "Sun: Closed",
  },

  // ─── STATS ───────────────────────────────────────────────────────────────
  // Used in Hero and SocialProof sections
  stats: {
    installs: "2,400+",
    years: "50+",
    rating: "4.9★",
    satisfaction: "98%",
  },

  // ─── SERVICES ────────────────────────────────────────────────────────────
  // Used in the Services section and the estimate form dropdown
  services: [
    { value: "cameras", label: "CCTV & Camera Systems" },
    { value: "alarms", label: "Alarm Systems" },
    { value: "access", label: "Access Control" },
    { value: "cabling", label: "Data & Voice Cabling Infrastructure" },
    { value: "consultation", label: "Security Consultation" },
    { value: "other", label: "Other / Not Sure" },
  ],

  // ─── NAVIGATION ──────────────────────────────────────────────────────────
  // Used in Navbar and Footer
  navLinks: [
    { label: "Services", href: "/services" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],

  // ─── SOCIAL ──────────────────────────────────────────────────────────────
  social: {
    facebook: "https://facebook.com/eyespycabling",
    instagram: "https://instagram.com/eyespycabling",
    google: "https://g.page/eyespycabling",
  },

  // ─── SEO ─────────────────────────────────────────────────────────────────
  // Used in layout.tsx metadata
  seo: {
    title: "Eyespy Cabling | Low-Voltage Contractor NYC & Long Island",
    description:
      "Eyespy Cabling installs CCTV, access control, alarm systems, and structured cabling for commercial clients across NYC, Long Island & Westchester.",
    keywords:
      "security system installation, CCTV cameras, alarm systems, access control, [City]",
    url: "https://www.eyespycabling.com",
  },
};
