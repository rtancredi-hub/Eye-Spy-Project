export const blogPost = {
  name: "blogPost",
  title: "Blog Posts",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Post Title",
      type: "string",
      description:
        "Keep titles clear and specific. Good: 'How to Choose a Security Camera System'. Bad: 'Cameras'.",
      validation: (R: any) => R.required().error("Title is required"),
    },
    {
      name: "slug",
      title: "URL Slug",
      type: "slug",
      description:
        "This becomes the URL of the post. Click Generate to create it automatically from the title. Example: how-to-choose-a-security-camera-system",
      options: { source: "title", maxLength: 96 },
      validation: (R: any) =>
        R.required().error("Slug is required — click Generate"),
    },
    {
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description:
        "1-2 sentence summary shown on the blog index page. Write this like a teaser — make people want to read more.",
      validation: (R: any) => R.required().error("Excerpt is required"),
    },
    {
      name: "category",
      title: "Category",
      type: "string",
      description:
        "Choose the category that best fits the post. This controls which filter button shows the post.",
      options: {
        list: [
          { title: "Buyer's Guide", value: "Buyer's Guide" },
          { title: "Security Tips", value: "Security Tips" },
          { title: "Commercial", value: "Commercial" },
        ],
        layout: "radio",
      },
    },
    {
      name: "readTime",
      title: "Read Time",
      type: "string",
      description:
        "Estimate how long the post takes to read. Average reader reads 200 words/minute. Example: 4 min read",
    },
    {
      name: "date",
      title: "Publication Date",
      type: "string",
      description: "Month and year only. Example: March 2026",
    },
    {
      name: "featured",
      title: "Featured Post",
      type: "boolean",
      description:
        "Turn on to make this the large featured card at the top of the blog page. Only one post should be featured at a time — turn off the previous featured post when enabling a new one.",
      initialValue: false,
    },
    {
      name: "content",
      title: "Article Content",
      type: "array",
      description:
        "Write your article here. Use the toolbar to add headings, bullet points, and images. Press Enter for a new paragraph.",
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
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              title: "Image Description",
              type: "string",
              description:
                "Describe the image for accessibility and SEO. Example: SecurTech technician installing security camera",
            },
          ],
        },
      ],
    },
    {
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "author" }],
      description: "Who wrote this post. Leave blank to attribute the post to the business.",
    },
    {
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      description: "Exact publish date/time, used for SEO and sorting. Leave blank to keep using the Publication Date text above.",
    },
    {
      name: "seo",
      title: "SEO",
      type: "seo",
      description: "Advanced SEO overrides (title, description, canonical URL, hide from search). Defaults to the post title/excerpt if left blank.",
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category" },
  },
};
