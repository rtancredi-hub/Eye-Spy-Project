import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { sanityFetch } from "@/app/lib/sanity";
import { singlePostQuery, allPostsQuery } from "@/app/lib/queries";
import { type BlogPost } from "@/app/lib/types";
import { siteConfig } from "@/app/config/site";
import { parseMonthYearToISO } from "@/app/lib/utils";
import { buildMetadata } from "@/app/lib/seo";
import { buildBreadcrumbSchema } from "@/app/lib/breadcrumb";
import JsonLd from "@/app/components/JsonLd";
import BlogPostClient from "./BlogPostClient";
import type { Article, WithContext } from "schema-dts";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<BlogPost | null>(singlePostQuery, { slug });

  if (!post) return { title: `Post Not Found | ${siteConfig.name}` };

  return buildMetadata({
    title: post.seo?.title ?? `${post.title} | ${siteConfig.name} Blog`,
    description: post.seo?.description ?? post.excerpt,
    path: `/blog/${slug}`,
    siteUrl: siteConfig.seo.url,
    siteName: siteConfig.name,
    ogImage: post.seo?.ogImage,
    canonical: post.seo?.canonical,
    noindex: post.seo?.noindex,
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [post, allPosts] = await Promise.all([
    sanityFetch<BlogPost | null>(singlePostQuery, { slug }),
    sanityFetch<BlogPost[]>(allPostsQuery),
  ]);

  if (!post) notFound();

  // Find related posts — same category, excluding current post
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  const articleSchema: WithContext<Article> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.seo.url}/blog/${slug}#article`,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt ?? parseMonthYearToISO(post.date),
    dateModified: post._updatedAt ?? post.publishedAt ?? parseMonthYearToISO(post.date),
    url: `${siteConfig.seo.url}/blog/${slug}`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.seo.url}/blog/${slug}`,
    },
    articleSection: post.category,
    author: post.author
      ? { "@type": "Person", name: post.author.name }
      : {
          "@type": "Organization",
          "@id": `${siteConfig.seo.url}/#organization`,
          name: siteConfig.name,
        },
    publisher: {
      "@type": "Organization",
      "@id": `${siteConfig.seo.url}/#organization`,
      name: siteConfig.name,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.seo.url}/logopng.png`,
      },
    },
  };

  const breadcrumbSchema = buildBreadcrumbSchema(
    [
      { name: "Home", path: "" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${slug}` },
    ],
    siteConfig.seo.url,
  );

  return (
    <>
      <JsonLd schema={articleSchema} />
      <JsonLd schema={breadcrumbSchema} />
      <BlogPostClient post={post} relatedPosts={relatedPosts} />
    </>
  );
}
