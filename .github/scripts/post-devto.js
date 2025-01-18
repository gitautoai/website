const fs = require("fs");
const path = require("path");

/**
 * @see https://developers.forem.com/api/v1#operation/createArticle
 */
async function postDevTo({ isBlog, postUrl }) {
  if (!isBlog) return; // Only post blogs to dev.to

  // Extract blog path from the URL
  const urlPath = new URL(postUrl).pathname;
  const blogPath = path.join(process.cwd(), "app", urlPath, "page.mdx");
  console.log({ urlPath, blogPath });

  // Read the blog content
  const content = fs.readFileSync(blogPath, "utf-8");

  // Parse the metadata
  const metadataMatch = content.match(/export const metadata = ({[\s\S]*?});/);
  const metadata = eval(`(${metadataMatch[1]})`);
  console.log({ metadata });

  // Extract the actual markdown content (everything after the metadata)
  const markdownContent = content.split(/export const metadata = {[\s\S]*?};/)[1].trim();

  // Prepare the article
  // https://developers.forem.com/api/v1#operation/createArticle
  const article = {
    article: {
      title: metadata.title,
      body_markdown: markdownContent,
      published: true,
      canonical_url: postUrl,
      description: metadata.description,
      tags: metadata.tags.slice(0, 4), // dev.to limits tags to 4
      organization_id: 10134, // https://dev.to/dashboard/organization/10134
    },
  };

  // Post to dev.to
  const response = await fetch("https://dev.to/api/articles", {
    method: "POST",
    headers: {
      accept: "application/vnd.forem.api-v1+json",
      "api-key": process.env.DEVTO_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(article),
  });

  if (!response.ok) {
    throw new Error(`Failed to post to dev.to: ${response.statusText}`);
  }
}

module.exports = postDevTo;
