// ─── SITEMAP ──────────────────────────────────────────────────────────────────
// _updatedAt for the singleton pages, used for sitemap lastModified.
export const sitemapSingletonsQuery = `{
  "home": *[_type == "homePage"][0]{ _updatedAt },
  "about": *[_type == "aboutPage"][0]{ _updatedAt },
  "contact": *[_type == "contactPage"][0]{ _updatedAt },
  "pricing": *[_type == "pricingPage"][0]{ _updatedAt }
}`;

// ─── SITE SETTINGS ───────────────────────────────────────────────────────────
export const siteSettingsQuery = `
  *[_type == "siteSettings"][0]{
    siteName,
    tagline,
    description,
    phone,
    email,
    address,
    serviceArea,
    siteUrl,
    reviewCount,
    hours,
    stats,
    social
  }
`;

// ─── BLOG POSTS ───────────────────────────────────────────────────────────────
export const allPostsQuery = `
  *[_type == "blogPost"] | order(date desc){
    "slug": slug.current,
    title,
    excerpt,
    category,
    readTime,
    date,
    featured,
    _updatedAt,
    "noindex": seo.noindex
  }
`;

export const singlePostQuery = `
  *[_type == "blogPost" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    excerpt,
    category,
    readTime,
    date,
    featured,
    content,
    seo{title, description, ogImage, canonical, noindex},
    publishedAt,
    _updatedAt,
    author->{ name, role, bio, photo }
  }
`;

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────
export const testimonialsQuery = `
  *[_type == "testimonial"]{
    quote,
    name,
    location,
    rating
  }
`;

// ─── FAQ ──────────────────────────────────────────────────────────────────────
export const faqQuery = `
  *[_type == "faqItem"] | order(order asc){
    question,
    answer
  }
`;

// ─── TEAM ─────────────────────────────────────────────────────────────────────
export const teamQuery = `
  *[_type == "teamMember"] | order(order asc){
    name,
    role,
    years,
    bio,
    photo
  }
`;

// ─── SERVICES ─────────────────────────────────────────────────────────────────
// Single source of truth for all service consumers (Hero, Services grid, EstimateForm).
// Queries servicePage — the canonical service document type.
export const getAllServicesQuery = `
  *[_type == "servicePage"] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    shortDescription,
    icon,
    order
  }
`;

// ─── SERVICE AREAS ────────────────────────────────────────────────────────────
export const allAreasQuery = `
  *[_type == "serviceArea"]{
    name,
    "slug": slug.current,
    region,
    description,
    nearbyAreas,
    includesList
  }
`;

export const allAreaSlugsQuery = `
  *[_type == "serviceArea"]{ "slug": slug.current, _updatedAt, "noindex": seo.noindex }
`;

export const singleAreaQuery = `
  *[_type == "serviceArea" && slug.current == $slug][0]{
    name,
    "slug": slug.current,
    region,
    description,
    nearbyAreas,
    includesList,
    formPhotos[]{ asset, alt },
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// ─── SERVICE LANDING PAGES ────────────────────────────────────────────────────
export const allServiceLandingPageSlugsQuery = `
  *[_type == "serviceLandingPage"]{ "slug": slug.current, _updatedAt, "noindex": seo.noindex }
`;

export const singleServiceLandingPageQuery = `
  *[_type == "serviceLandingPage" && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    heroEyebrow,
    heroHeading,
    heroHeadingAccent,
    heroSubheading,
    includesList,
    formHeading,
    formSubheading,
    bottomCtaEyebrow,
    bottomCtaHeading,
    bottomCtaBody,
    formPhotos[]{ asset, alt },
    seo{title, description, ogImage, canonical, noindex},
    linkedService->{
      title,
      "slug": slug.current,
      shortDescription,
      features
    }
  }
`;

// ─── SERVICE PAGES ────────────────────────────────────────────────────────────
export const allServicePageSlugsQuery = `
  *[_type == "servicePage"]{ "slug": slug.current, _updatedAt, "noindex": seo.noindex }
`;

export const allServicePagesQuery = `
  *[_type == "servicePage"] | order(title asc){
    "slug": slug.current,
    title,
    shortDescription,
    icon
  }
`;

export const singleServicePageQuery = `
  *[_type == "servicePage" && slug.current == $slug][0]{
    "slug": slug.current,
    title,
    shortDescription,
    longDescription,
    icon,
    images[]{ asset, alt },
    features,
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// ─── ABOUT PAGE ───────────────────────────────────────────────────────────────
export const aboutPageQuery = `
  *[_type == "aboutPage"][0]{
    heroEyebrow,
    heroHeadingLine1,
    heroHeadingLine2,
    heroSubtitle,
    storyEyebrow,
    storyHeading,
    storyParagraphs,
    valuesEyebrow,
    valuesHeading,
    values[]{
      iconName,
      title,
      description
    },
    ctaEyebrow,
    ctaHeading,
    ctaBody,
    ctaButtonLabel,
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// ─── CONTACT PAGE ─────────────────────────────────────────────────────────────
export const contactPageQuery = `
  *[_type == "contactPage"][0]{
    heroEyebrow,
    heroHeadingLine1,
    heroHeadingLine2,
    heroSubtitle,
    formHeading,
    successHeading,
    successBody,
    infoHeading,
    serviceAreaLabel,
    serviceAreaNote,
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
// Singleton — returns the homePage document with Benefits + HowItWorks content.
export const homePageQuery = `
  *[_type == "homePage"][0]{
    heroHeading,
    heroHeadingAccent,
    heroSubheading,
    benefitsEyebrow,
    benefitsHeading,
    benefitsSubheading,
    benefits[]{
      iconName,
      title,
      description
    },
    howItWorksEyebrow,
    howItWorksHeading,
    howItWorksSubheading,
    howItWorksSteps[]{
      step,
      title,
      description
    },
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
// Singleton — returns [0] directly, not wrapped in array.
// service-> dereferences the reference and projects only the fields needed.
// "slug": slug.current flattens the slug object to a plain string, consistent
// with every other query in this file.
export const pricingPageQuery = `
  *[_type == "pricingPage"][0]{
    pageTitle,
    pageSubtitle,
    introText,
    bottomCtaHeading,
    bottomCtaText,
    faqTitle,
    faqItems[]{
      _key,
      question,
      answer
    },
    seo{title, description, ogImage, canonical, noindex}
  }
`;

// Fetches all servicePage documents that have a priceLabel set.
// The filter is the toggle: leave priceLabel blank to hide a service from the pricing page.
export const pricingServicesQuery = `
  *[_type == "servicePage" && defined(priceLabel) && priceLabel != ""] | order(order asc, title asc){
    _id,
    title,
    "slug": slug.current,
    icon,
    shortDescription,
    priceLabel,
    priceNote,
    pricingHighlights,
    pricingCtaLabel,
    pricingFeatured,
    order
  }
`;
