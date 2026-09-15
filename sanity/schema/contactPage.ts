export const contactPage = {
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  __experimental_actions: ["update", "publish"],
  fieldsets: [
    { name: "hero", title: "🏠 Hero Section" },
    { name: "form", title: "📝 Form Section" },
    { name: "info", title: "📋 Contact Info Section" },
    { name: "seo", title: "🔍 SEO" },
  ],
  fields: [
    // ── Hero ──────────────────────────────────────────────────────────────────
    {
      name: "heroEyebrow",
      title: "Hero Eyebrow",
      type: "string",
      fieldset: "hero",
      description: 'Small label above the heading. Example: "Get In Touch"',
    },
    {
      name: "heroHeadingLine1",
      title: "Hero Heading — Line 1",
      type: "string",
      fieldset: "hero",
      description: 'First line. Example: "We\'d Love to"',
    },
    {
      name: "heroHeadingLine2",
      title: "Hero Heading — Line 2 (gradient)",
      type: "string",
      fieldset: "hero",
      description: 'Second line shown in gradient. Example: "Hear From You."',
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
      rows: 2,
      fieldset: "hero",
      description: "Short paragraph below the heading.",
    },

    // ── Form ──────────────────────────────────────────────────────────────────
    {
      name: "formHeading",
      title: "Form Section Heading",
      type: "string",
      fieldset: "form",
      description: 'Heading above the contact form. Example: "Send Us a Message"',
    },
    {
      name: "successHeading",
      title: "Success Heading",
      type: "string",
      fieldset: "form",
      description: 'Shown after form submits. Example: "Message Sent!"',
    },
    {
      name: "successBody",
      title: "Success Body",
      type: "text",
      rows: 2,
      fieldset: "form",
      description: "Text shown after form submits. Use {name} to insert the customer's first name.",
    },

    // ── Info ──────────────────────────────────────────────────────────────────
    {
      name: "infoHeading",
      title: "Info Section Heading",
      type: "string",
      fieldset: "info",
      description: 'Heading above the contact info cards. Example: "Contact Information"',
    },
    {
      name: "serviceAreaLabel",
      title: "Service Area Label",
      type: "string",
      fieldset: "info",
      description: 'Small label above the service area text. Example: "Service Area"',
    },
    {
      name: "serviceAreaNote",
      title: "Service Area Note",
      type: "text",
      rows: 2,
      fieldset: "info",
      description: "Extra sentence after the service area. Example: \"Not sure if we cover your area? Give us a call.\"",
    },

    // ── SEO ───────────────────────────────────────────────────────────────────
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      fieldset: "seo",
      description: "SEO title, description, social share image, canonical URL, and hide-from-search toggle.",
    },
  ],

  preview: {
    prepare() {
      return { title: "Contact Page" };
    },
  },
};
