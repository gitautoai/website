// Third-party imports
import fs from "fs/promises";
import { glob } from "glob";
import type { MetadataRoute } from "next";

// Local imports
import { NEXT_PUBLIC_SITE_URL, RELATIVE_URLS } from "@/config/urls";

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
        url: `${NEXT_PUBLIC_SITE_URL}${route}`,
        lastModified,
        changeFrequency,
        priority,
      };
    })
  );

  return routes.sort((a, b) => {
    if (a.priority !== b.priority) {
      return b.priority - a.priority;
    }
    return b.lastModified.getTime() - a.lastModified.getTime();
  });
}
