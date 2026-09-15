export const pricingPage = {
  name: "pricingPage",
  title: "Pricing Page",
  type: "document",
  // Singleton — prevent creating more than one document of this type
  __experimental_actions: ["update", "publish"],

  fields: [
    // ── Page header ───────────────────────────────────────────────────────────
    {
      name: "pageTitle",
      title: "Page Title",
      type: "string",
      description: 'Displayed as the main heading. Example: "Transparent Pricing"',
      validation: (R: any) => R.required().error("Page title is required"),
    },
    {
      name: "pageSubtitle",
      title: "Page Subtitle",
      type: "string",
      description: 'Shown below the title. Example: "No surprises. No hidden fees."',
    },
    {
      name: "introText",
      title: "Intro Text",
      type: "text",
      rows: 3,
      description:
        "Short paragraph shown between the subtitle and the pricing cards.",
    },

    // ── Bottom CTA ────────────────────────────────────────────────────────────
    {
      name: "bottomCtaHeading",
      title: "Bottom CTA Heading",
      type: "string",
      description:
        'Heading for the final call-to-action section. Example: "Not sure which plan fits?"',
    },
    {
      name: "bottomCtaText",
      title: "Bottom CTA Body Text",
      type: "text",
      rows: 2,
      description: "Supporting paragraph shown below the CTA heading.",
    },

    // ── FAQ section ───────────────────────────────────────────────────────────
    {
      name: "faqTitle",
      title: "FAQ Section Title",
      type: "string",
      description:
        'Optional title for the FAQ section. Defaults to "Pricing FAQs" if left blank.',
    },
    {
      name: "faqItems",
      title: "FAQ Items",
      type: "array",
      description:
        "Pricing-specific FAQs. These are separate from the global FAQ documents.",
      of: [
        {
          type: "object",
          name: "pricingFaq",
          title: "FAQ Item",
          fields: [
            {
              name: "question",
              title: "Question",
              type: "string",
              validation: (R: any) =>
                R.required().error("Question is required"),
            },
            {
              name: "answer",
              title: "Answer",
              type: "text",
              rows: 3,
              validation: (R: any) => R.required().error("Answer is required"),
            },
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    },
    // ── SEO ───────────────────────────────────────────────────────────────────
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO title, description, social share image, canonical URL, and hide-from-search toggle. Defaults to the page title if left blank.",
    },
  ],

  preview: {
    prepare() {
      return { title: "Pricing Page" };
    },
  },
};
