import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogIndex() {
  const posts = await getBlogPosts();

  return (
    <main className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-3xl md:text-4xl text-center font-semibold mb-8">Blog Posts</h1>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group border-t pt-8">
            <Link href={`/blog/${post.slug}`} className="block">
              <h2 className="text-xl md:text-2xl font-semibold group-hover:text-pink-600">
                {post.title}
              </h2>
              <time className="text-sm text-gray-600">
                {new Date(post.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </time>
              <p className="mt-2 text-gray-700">{post.excerpt}</p>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
