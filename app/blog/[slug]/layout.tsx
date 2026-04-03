import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { slackUs } from "@/app/actions/slack/slack-us";
import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { BASE_URL, ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { getBlogPostFromPosts } from "../utils/get-blog-post-from-posts";
import { createBlogPostJsonLd } from "./jsonld";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostFromPosts(slug);

  if (!post) {
    return createPageMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    });
  }

  return createPageMetadata({
    title: `${post.title} - ${PRODUCT_NAME} Blog`,
    description: post.description,
    url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${slug}`,
    keywords: post.tags || [],
    images: [{ url: BASE_URL + "/og/blog-" + slug + ".png", alt: post.title }],
    type: "article",
  });
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const { slug } = await params;
  const post = await getBlogPostFromPosts(slug);

  if (!post) {
    const headersList = await headers();
    const referer = headersList.get("referer") || "direct";
    const userAgent = headersList.get("user-agent") || "unknown";
    console.error(`Blog post not found: ${slug}`);
    await slackUs(`📝 Blog post not found: /blog/${slug}\nReferer: ${referer}\nUA: ${userAgent}`);
    redirect("/blog");
  }

  const jsonLd = createBlogPostJsonLd(post, slug);

  return (
    <>
      <JsonLdScript data={jsonLd} id="jsonld-blogpost" />
      {children}
    </>
  );
}
