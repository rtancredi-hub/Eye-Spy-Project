export const serviceLandingPage = {
  name: "serviceLandingPage",
  title: "Service Landing Pages",
  type: "document",
  groups: [
    { name: "services", title: "Linked Service" },
    { name: "hero", title: "Hero Section" },
    { name: "form", title: "Form" },
    { name: "cta", title: "Bottom CTA" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    {
      name: "title",
      title: "Page Title (Internal)",
      type: "string",
      description: "Internal name only — not shown on site. Example: CCTV Installation LP",
      validation: (R: any) => R.required().error("Title is required"),
    },
    {
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "Becomes the URL: /lp/[slug]. Click Generate to auto-fill from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (R: any) => R.required().error("Slug is required — click Generate"),
    },

    // ── Linked Service ────────────────────────────────────────────────────────
    {
      name: "linkedService",
      title: "Linked Service Page",
      type: "reference",
      to: [{ type: "servicePage" }],
      group: "services",
      description:
        "Optionally link to an existing service page. If the Hero Subheading or Includes List above are left blank, they will auto-populate from this service's description and features.",
    },

    // ── Hero ──────────────────────────────────────────────────────────────────
    {
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      group: "hero",
      description: 'Small text above the headline. Example: "Licensed & Insured · Greater New York"',
    },
    {
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      group: "hero",
      description: "Main h1 headline. Example: Get a Free Security System Estimate",
      validation: (R: any) => R.required().error("Hero heading is required"),
    },
    {
      name: "heroHeadingAccent",
      title: "Hero Heading Accent",
      type: "string",
      group: "hero",
      description: "Gradient-coloured second line beneath the heading. Example: Today.",
    },
    {
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      group: "hero",
      description: "Paragraph shown below the headline. 1–3 sentences.",
    },
    {
      name: "includesList",
      title: "Includes List",
      type: "array",
      group: "hero",
      description: "Checklist bullets shown below the subheading. 3–5 items recommended.",
      of: [{ type: "string" }],
    },

    // ── Form ──────────────────────────────────────────────────────────────────
    {
      name: "formHeading",
      title: "Form Heading",
      type: "string",
      group: "form",
      description: 'Heading inside the estimate form card. Example: "Request Your Free Estimate"',
      initialValue: "Request Your Free Estimate",
    },
    {
      name: "formSubheading",
      title: "Form Subheading",
      type: "string",
      group: "form",
      description: "Small text below the form heading.",
      initialValue: "We'll respond within 1 business day.",
    },
    {
      name: "formPhotos",
      title: "Photos Above Form (Bottom Section)",
      type: "array",
      group: "form",
      description:
        "Optional photos shown in a carousel above the estimate form near the bottom of the page. Leave empty to hide this section.",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Image Description",
              type: "string",
              description: "Describe the image for accessibility and SEO.",
            },
          ],
        },
      ],
    },

    // ── Bottom CTA ────────────────────────────────────────────────────────────
    {
      name: "bottomCtaEyebrow",
      title: "Bottom CTA Eyebrow",
      type: "string",
      group: "cta",
      description: 'Small text above the bottom CTA heading. Example: "Still Have Questions?"',
    },
    {
      name: "bottomCtaHeading",
      title: "Bottom CTA Heading",
      type: "string",
      group: "cta",
      description: 'Main heading for the bottom section. Example: "Talk to Us First"',
    },
    {
      name: "bottomCtaBody",
      title: "Bottom CTA Body",
      type: "text",
      rows: 2,
      group: "cta",
      description: "Supporting paragraph in the bottom CTA section.",
    },

    // ── SEO ───────────────────────────────────────────────────────────────────
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      group: "seo",
      description: "SEO title, description, social share image, canonical URL, and hide-from-search toggle. Defaults to Hero Heading/Subheading if blank.",
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "slug.current",
    },
    prepare({ title, subtitle }: { title: string; subtitle: string }) {
      return { title, subtitle: subtitle ? `/lp/${subtitle}` : "No slug set" };
    },
  },
};
