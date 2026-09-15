// ─── SEO ──────────────────────────────────────────────────────────────────────
// Shared shape for the `seo` object field (sanity/schema/objects/seo.ts) —
// present on every publicly-routable document type. See docs/SEO-AEO-GEO.md.
export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: any;
  canonical?: string;
  noindex?: boolean;
}

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
export interface AboutPageValue {
  iconName?: string;
  title: string;
  description?: string;
}

export interface AboutPageData {
  heroEyebrow?: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroSubtitle?: string;
  storyEyebrow?: string;
  storyHeading?: string;
  storyParagraphs?: string[];
  valuesEyebrow?: string;
  valuesHeading?: string;
  values?: AboutPageValue[];
  ctaEyebrow?: string;
  ctaHeading?: string;
  ctaBody?: string;
  ctaButtonLabel?: string;
  seo?: SeoFields;
}

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
export interface ContactPageData {
  heroEyebrow?: string;
  heroHeadingLine1?: string;
  heroHeadingLine2?: string;
  heroSubtitle?: string;
  formHeading?: string;
  successHeading?: string;
  successBody?: string;
  infoHeading?: string;
  serviceAreaLabel?: string;
  serviceAreaNote?: string;
  seo?: SeoFields;
}

// ─── HOW IT WORKS ─────────────────────────────────────────────────────────────
export interface HowItWorksStep {
  step: string;
  title: string;
  description: string;
}

// ─── BENEFITS ─────────────────────────────────────────────────────────────────
export interface BenefitItem {
  iconName: string;
  title: string;
  description: string;
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
export interface HomePageData {
  heroHeading?: string;
  heroHeadingAccent?: string;
  heroSubheading?: string;
  benefitsEyebrow?: string;
  benefitsHeading?: string;
  benefitsSubheading?: string;
  benefits?: BenefitItem[];
  howItWorksEyebrow?: string;
  howItWorksHeading?: string;
  howItWorksSubheading?: string;
  howItWorksSteps?: HowItWorksStep[];
  seo?: SeoFields;
}

// ─── SITE SETTINGS ────────────────────────────────────────────────────────────
export interface SiteSettings {
  siteName: string;
  tagline: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  serviceArea: string;
  siteUrl?: string;
  reviewCount?: number;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  stats: {
    installs: string;
    years: string;
    rating: string;
    satisfaction: string;
  };
  social: {
    facebook: string;
    instagram: string;
    google: string;
  };
}

// ─── AUTHOR ───────────────────────────────────────────────────────────────────
export interface Author {
  name: string;
  role?: string;
  bio?: string;
  photo?: any;
}

// ─── BLOG ─────────────────────────────────────────────────────────────────────
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  featured: boolean;
  content?: any[];
  seo?: SeoFields;
  author?: Author;
  publishedAt?: string;
  _updatedAt?: string;
}

// ─── TESTIMONIAL ──────────────────────────────────────────────────────────────
export interface Testimonial {
  quote: string;
  name: string;
  location: string;
  rating: number;
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export interface FaqItem {
  question: string;
  answer: string;
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────
export interface TeamMember {
  name: string;
  role: string;
  years: string;
  bio: string;
  photo?: any;
}

// ─── SERVICE ──────────────────────────────────────────────────────────────────
export interface Service {
  _id: string;
  title: string;
  slug: string;
  shortDescription?: string;
  icon?: string;
  order?: number;
}

// ─── SERVICE AREA ─────────────────────────────────────────────────────────────
export interface ServiceArea {
  name: string;
  slug: string;
  region: string;
  description: string;
  nearbyAreas: string[];
  includesList?: string[];
  formPhotos?: { asset: any; alt?: string }[];
  seo?: SeoFields;
}

// ─── SERVICE LANDING PAGE ─────────────────────────────────────────────────────
export interface ServiceLandingPage {
  title: string;
  slug: string;
  heroEyebrow?: string;
  heroHeading: string;
  heroHeadingAccent?: string;
  heroSubheading?: string;
  includesList?: string[];
  formHeading?: string;
  formSubheading?: string;
  bottomCtaEyebrow?: string;
  bottomCtaHeading?: string;
  bottomCtaBody?: string;
  formPhotos?: { asset: any; alt?: string }[];
  seo?: SeoFields;
  linkedService?: {
    title: string;
    slug: string;
    shortDescription?: string;
    features?: string[];
  };
}

// ─── SERVICE PAGE ─────────────────────────────────────────────────────────────
export interface ServicePage {
  slug: string;
  title: string;
  shortDescription?: string;
  longDescription?: any[]; // Sanity block content — matches BlogPost.content convention
  icon?: string;
  images?: { asset: any; alt?: string }[];
  features?: string[];
  seo?: SeoFields;
  // Pricing fields — optional; only present when priceLabel is set
  priceLabel?: string;
  priceNote?: string;
  pricingHighlights?: string[];
  pricingCtaLabel?: string;
  pricingFeatured?: boolean;
  order?: number;
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────

// Represents a servicePage document with pricing data, as returned by pricingServicesQuery.
// priceLabel is guaranteed non-empty by the GROQ filter.
export interface PricingService {
  _id: string;
  title: string;
  slug: string;
  icon?: string;
  shortDescription?: string;
  priceLabel: string;
  priceNote?: string;
  pricingHighlights?: string[];
  pricingCtaLabel?: string;
  pricingFeatured?: boolean;
  order?: number;
}

export interface PricingFaqItem {
  _key: string;
  question: string;
  answer: string;
}

export interface PricingPage {
  pageTitle: string;
  pageSubtitle?: string;
  introText?: string;
  bottomCtaHeading?: string;
  bottomCtaText?: string;
  faqTitle?: string;
  faqItems?: PricingFaqItem[];
  seo?: SeoFields;
}
