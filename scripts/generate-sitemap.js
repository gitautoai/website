// Description: Generates a sitemap.xml file for SEO purposes
// See https://github.com/vercel/next.js/blob/canary/examples/with-sitemap/scripts/generate-sitemap.js
import fs from "fs";
import globby from "globby";

// Get the lastmod value for a specific page by running git log against the file
const getLastmod = (page) => {
  try {
    // Attempt to get the last commit date for the file
    const mtime = fs.statSync(page).mtime;
    return new Date(mtime).toISOString();
  } catch (error) {
    return new Date().toISOString();
  }
};

/** Add hreflang links to the sitemap */
const addHrefLangLinks = (route, siteUrl) => {
  let links = "";
  // Add x-default link
  links += `<xhtml:link rel="alternate" href="${siteUrl}${route}" hreflang="x-default" />`;

  return links;
};

/**
 * Process each page and generate sitemap entries
 * @param {string} page
 * @param {number} pageIndex
 * @param {string} localeKey
 * @returns
 */
const addPage = (page, pageIndex, localeKey) => {
  const lastmod = getLastmod(page);

  // Remove the "pages" and extension to get the path
  const path = page
    .replace("pages", "")
    .replace("posts/en", "/blog")
    .replace(".tsx", "")
    .replace(".jsx", "")
    .replace(".mdx", "");

  // Remove trailing "/index". 6 === "/index".length
  const route = path.endsWith("/index") ? path.slice(0, -6) : path;

  // Base URL of the site
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  const siteLocaleUrl =
    localeKey === "en" ? siteUrl : `${siteUrl}/${localeKey}`;

  // Add hreflang links
  const hrefLangLinks = addHrefLangLinks(route, siteUrl);

  // Return sitemap entry
  return `
<url key="${"page-" + pageIndex + "-" + localeKey}">
  <loc>${`${siteLocaleUrl}${route}`}</loc>
  <changefreq>daily</changefreq>
  <priority>0.7</priority>
  <lastmod>${lastmod}</lastmod>
  ${hrefLangLinks}
</url>
`;
};

const generateSitemap = async () => {
  // Ignore Next.js specific files (e.g., _app.js) and API routes.
  const pages = await globby([
    "pages/**/*{.js,.jsx,.ts,.tsx,.mdx}",
    "!pages/_*{.js,.jsx,.ts,.tsx,.mdx}",
    "!pages/api",
    "!pages/blog/[slug].tsx", // Ignore this dynamic page, we'll handle it separately
    "posts/en/*.mdx", // Get all blog posts from the English locale
  ]);

  // Generate the sitemap entries for each page for each locale
  let sitemap = "";

  // Create the final sitemap XML
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  ${sitemap}
</urlset>
`;

  // Write the sitemap to the public directory
  fs.writeFileSync("public/sitemap.xml", sitemapXml);
};

// Call the function to generate the sitemap
generateSitemap();
