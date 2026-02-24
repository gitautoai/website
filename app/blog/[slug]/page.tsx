import { notFound } from "next/navigation";
import { getBlogPostFromPosts } from "../utils/get-blog-post-from-posts";
import { getBlogPosts } from "../utils/get-blog-posts";

export const generateStaticParams = async () => {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogPostFromPosts(slug);

  if (!post) notFound();

  // Use the actual filename (which may include date prefix) when importing
  const filename = post.filename || slug;

  // Avoid React errors by dynamically importing the MDX file
  try {
    const MDXContent = await import(`../posts/${filename}.mdx`).then((mod) => mod.default);

    return (
      <article>
        <MDXContent />
      </article>
    );
  } catch (error) {
    console.error(`Error loading MDX for ${slug}:`, error);
    notFound();
  }
}
