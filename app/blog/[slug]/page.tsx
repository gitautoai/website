import { notFound } from "next/navigation";
import { getBlogPostFromPosts } from "../utils/get-blog-post-from-posts";

export default async function BlogPost({ params }: { params: { slug: string } }) {
  const post = await getBlogPostFromPosts(params.slug);

  if (!post) notFound();

  // Avoid React errors by dynamically importing the MDX file
  try {
    const MDXContent = await import(`../posts/${params.slug}.mdx`).then((mod) => mod.default);

    return (
      <article>
        <MDXContent />
      </article>
    );
  } catch (error) {
    console.error(`Error loading MDX for ${params.slug}:`, error);
    notFound();
  }
}
