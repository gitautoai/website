import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { getBlogPostFromPosts } from "../utils/get-blog-post-from-posts";
import { createBlogPostJsonLd } from "./jsonld";

interface BlogPostLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getBlogPostFromPosts(params.slug);

  if (!post) {
    return createPageMetadata({
      title: "Blog Post Not Found",
      description: "The requested blog post could not be found.",
      url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${params.slug}`,
    });
  }

  return createPageMetadata({
    title: `${post.title} - ${PRODUCT_NAME} Blog`,
    description: post.description,
    url: `${ABSOLUTE_URLS.GITAUTO.BLOG}/${params.slug}`,
    keywords: post.tags || [],
    images: [{ url: ABSOLUTE_URLS.GITAUTO.INDEX + "/og/blog-" + params.slug + ".png", alt: post.title }],
    type: "article",
  });
}

export default async function BlogPostLayout({ children, params }: BlogPostLayoutProps) {
  const post = await getBlogPostFromPosts(params.slug);

  if (!post) {
    console.error(`Blog post not found: ${params.slug}`);
    return <div>{children}</div>;
  }

  const jsonLd = createBlogPostJsonLd(post, params.slug);

  return (
    <>
      <JsonLdScript data={jsonLd} id="jsonld-blogpost" />
      {children}
    </>
  );
}
