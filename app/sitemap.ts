// Third-party imports
import fs from "fs/promises";
import { glob } from "glob";
import type { MetadataRoute } from "next";

// Local imports
import { getBlogPosts } from "@/app/blog/utils/get-blog-posts";
import { BASE_URL, RELATIVE_URLS } from "@/config/urls";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await glob("app/**/page.{ts,tsx,js,jsx,md,mdx}", {
    ignore: ["app/api/**", "app/_*/**"],
  });

  const routes = await Promise.all(
    pages.map(async (page) => {
      const route = page
        .replace("app", "")
        .replace(/\/page\.(ts|tsx|js|jsx|md|mdx)$/, "")
        .replace(/\/+/g, "/");

      // Skip dynamic routes like [slug]
      if (route.includes("[") && route.includes("]")) return null;

      const isLessImportant =
        route === RELATIVE_URLS.PRIVACY_POLICY || route === RELATIVE_URLS.TERMS_OF_SERVICE;
      const priority = route === "" ? 1.0 : isLessImportant ? 0.3 : 0.8;
      const changeFrequency = isLessImportant ? ("yearly" as const) : ("weekly" as const);

      let lastModified = new Date();
      if (page.endsWith(".mdx")) {
        const content = await fs.readFile(page, "utf-8");
        const match = content.match(/updatedAt:\s*"([^"]+)"/);
        if (match && match[1]) lastModified = new Date(match[1]);
      }

      return {
        url: `${BASE_URL}${route}`,
        lastModified,
        changeFrequency,
        priority,
      };
    })
  );

  // Add individual blog posts
  const blogPosts = await getBlogPosts();
  const blogRoutes = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  // Filter out null routes and combine with blog routes
  const allRoutes = [...routes.filter((route) => route !== null), ...blogRoutes];

  return allRoutes.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.lastModified.getTime() - a.lastModified.getTime();
  });
}
