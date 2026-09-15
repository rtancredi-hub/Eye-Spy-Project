export const homePage = {
  name: "homePage",
  title: "Home Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fieldsets: [
    { name: "hero", title: "🏠 Hero Section" },
    { name: "benefits", title: "✅ Benefits Section" },
    { name: "howItWorks", title: "🔧 How It Works Section" },
    { name: "seo", title: "🔍 SEO" },
  ],
  fields: [
    // ── Hero ─────────────────────────────────────────────────────────────────────
    {
      name: "heroHeading",
      title: "Hero Heading",
      type: "string",
      fieldset: "hero",
      initialValue: "Security Systems",
      description: 'First line of the hero headline. Example: "Security Systems"',
    },
    {
      name: "heroHeadingAccent",
      title: "Hero Heading Accent (gradient line)",
      type: "string",
      fieldset: "hero",
      initialValue: "Built to Protect.",
      description: 'Second line, shown in the gradient accent color. Example: "Built to Protect."',
    },
    {
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "text",
      rows: 3,
      fieldset: "hero",
      initialValue:
        "From cameras and access control to full alarm systems — we design, install, and support security solutions that give you real peace of mind.",
      description: "1-sentence paragraph shown below the hero headline.",
    },

    // ── Benefits ────────────────────────────────────────────────────────────────
    {
      name: "benefitsEyebrow",
      title: "Benefits Eyebrow",
      type: "string",
      fieldset: "benefits",
      description: 'Small label above the heading. Example: "Why We\'re Different"',
    },
    {
      name: "benefitsHeading",
      title: "Benefits Heading",
      type: "string",
      fieldset: "benefits",
      description: 'Main section heading. Example: "Why choose Eye Spy?"',
    },
    {
      name: "benefitsSubheading",
      title: "Benefits Subheading",
      type: "string",
      fieldset: "benefits",
      description: "Short supporting sentence under the heading.",
    },
    {
      name: "benefits",
      title: "Benefit Items",
      type: "array",
      fieldset: "benefits",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "iconName",
              title: "Icon",
              type: "string",
              options: {
                list: [
                  { title: "Shield Check", value: "shieldCheck" },
                  { title: "Clock", value: "clock" },
                  { title: "Wrench", value: "wrench" },
                  { title: "Headphones", value: "headphones" },
                  { title: "Star", value: "star" },
                  { title: "Wifi", value: "wifi" },
                  { title: "Lock", value: "lock" },
                  { title: "Eye", value: "eye" },
                  { title: "Zap", value: "zap" },
                  { title: "Phone", value: "phone" },
                ],
                layout: "dropdown",
              },
            },
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (R: any) => R.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            },
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        },
      ],
    },

    // ── How It Works ─────────────────────────────────────────────────────────────
    {
      name: "howItWorksEyebrow",
      title: "How It Works Eyebrow",
      type: "string",
      fieldset: "howItWorks",
      description: 'Small label above the heading. Example: "The Process"',
    },
    {
      name: "howItWorksHeading",
      title: "How It Works Heading",
      type: "string",
      fieldset: "howItWorks",
      description: 'Main section heading. Example: "How It Works"',
    },
    {
      name: "howItWorksSubheading",
      title: "How It Works Subheading",
      type: "string",
      fieldset: "howItWorks",
      description: "Short supporting sentence under the heading.",
    },
    {
      name: "howItWorksSteps",
      title: "Steps",
      type: "array",
      fieldset: "howItWorks",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "step",
              title: "Step Number",
              type: "string",
              description: 'Example: "01", "02", "03"',
              validation: (R: any) => R.required(),
            },
            {
              name: "title",
              title: "Title",
              type: "string",
              validation: (R: any) => R.required(),
            },
            {
              name: "description",
              title: "Description",
              type: "text",
              rows: 2,
            },
          ],
          preview: {
            select: { title: "title", subtitle: "step" },
          },
        },
      ],
    },

    // ── SEO ───────────────────────────────────────────────────────────────────────
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      fieldset: "seo",
      description: "SEO title, description, social share image, canonical URL, and hide-from-search toggle. Defaults to the site name/description if left blank.",
    },
  ],
};
