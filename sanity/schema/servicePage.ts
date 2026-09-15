export const servicePage = {
  name: "servicePage",
  title: "Service Pages",
  type: "document",
  groups: [
    { name: "pricing", title: "Pricing" },
  ],
  fields: [
    {
      name: "title",
      title: "Service Title",
      type: "string",
      description: "The name of this service. Example: CCTV Installation",
      validation: (R: any) => R.required().error("Title is required"),
    },
    {
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description: "This becomes the URL of the service page. Click Generate to auto-fill from the title.",
      options: { source: "title", maxLength: 96 },
      validation: (R: any) => R.required().error("Slug is required — click Generate"),
    },
    {
      name: "shortDescription",
      title: "Short Description",
      type: "text",
      rows: 2,
      description: "1–2 sentences shown on service cards and the listing page.",
    },
    {
      name: "longDescription",
      title: "Full Description",
      type: "array",
      description: "Rich text content shown on the service detail page.",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal (Paragraph)", value: "normal" },
            { title: "Heading", value: "h2" },
            { title: "Sub-Heading", value: "h3" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet List", value: "bullet" },
            { title: "Numbered List", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
    },
    {
      name: "icon",
      title: "Icon",
      type: "string",
      description: "An emoji or short icon identifier shown on cards. Example: 📷",
    },
    {
      name: "images",
      title: "Gallery Images",
      type: "array",
      description: "Photos shown in the image gallery on the detail page.",
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
    {
      name: "features",
      title: "Features / Key Points",
      type: "array",
      description: "Bullet points highlighting the key features of this service.",
      of: [{ type: "string" }],
    },
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "SEO title, description, social share image, canonical URL, and hide-from-search toggle. Defaults to the service title/short description/first gallery image if left blank.",
    },
    {
      name: "order",
      title: "Sort Order",
      type: "number",
      description: "Controls display order in grids and dropdowns. Lower = first.",
    },
    {
      name: "priceLabel",
      title: "Price Label",
      type: "string",
      group: "pricing",
      description: 'Shown on the pricing card. Leave blank to hide this service from the pricing page. Example: "Starting at $499"',
    },
    {
      name: "priceNote",
      title: "Price Note",
      type: "string",
      group: "pricing",
      description: 'Small clarifying text below the price. Example: "Based on a 4-camera system"',
    },
    {
      name: "pricingHighlights",
      title: "Pricing Highlights",
      type: "array",
      group: "pricing",
      description: "Bullet points shown on the pricing card. Keep to 4–6 items. These are separate from the general Features list above.",
      of: [{ type: "string" }],
    },
    {
      name: "pricingCtaLabel",
      title: "Pricing CTA Button Label",
      type: "string",
      group: "pricing",
      description: "Text on the call-to-action button on the pricing card.",
      initialValue: "Get a Quote",
    },
    {
      name: "pricingFeatured",
      title: "Featured (Most Popular)",
      type: "boolean",
      group: "pricing",
      description: 'Mark this service as the recommended option. Adds an accent border and a "Most Popular" badge on the pricing page.',
      initialValue: false,
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "order",
    },
  },
};
