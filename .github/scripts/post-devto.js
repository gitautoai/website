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
  const utmParams = "?utm_source=devto&utm_medium=referral";
  const markdownContent = content
    .split(/export const metadata = {[\s\S]*?};/)[1]
    .trim()
    .replace(/\(\/([^)]*)\)/g, "(https://gitauto.ai/$1)") // Add domain to relative links
    .replace(/(https:\/\/[^)\s]*?gitauto\.ai[^)\s]*?)(?=[\s)])/g, "$1" + utmParams); // Add utm params to gitauto.ai links

  // Prepare the article
  // https://developers.forem.com/api/v1#operation/createArticle
  const newArticle = {
    article: {
      title: metadata.title,
      body_markdown: markdownContent,
      published: true,
      canonical_url: postUrl + utmParams,
      description: metadata.description,
      tags: metadata.tags.slice(0, 4), // dev.to limits tags to 4
      organization_id: 10134, // https://dev.to/dashboard/organization/10134
    },
  };

  // Common headers for dev.to API requests
  const headers = {
    accept: "application/vnd.forem.api-v1+json",
    "api-key": process.env.DEVTO_API_KEY,
    "Content-Type": "application/json",
  };

  // Search for existing article with the same canonical URL
  const searchResponse = await fetch(`https://dev.to/api/articles/me/all?per_page=1000`, {
    headers,
  });

  if (!searchResponse.ok)
    throw new Error(`Failed to search dev.to articles: ${searchResponse.statusText}`);

  const articles = await searchResponse.json();
  const existingArticle = articles.find((a) => {
    console.log("a.canonical_url", a.canonical_url);
    console.log("newArticle.article.canonical_url", newArticle.article.canonical_url);
    return a.canonical_url === newArticle.article.canonical_url;
  });

  // Update or create the article
  const endpoint = existingArticle
    ? `https://dev.to/api/articles/${existingArticle.id}`
    : "https://dev.to/api/articles";
  const method = existingArticle ? "PUT" : "POST";
  const body = JSON.stringify(newArticle);
  const response = await fetch(endpoint, { method, headers, body });

  if (!response.ok) throw new Error(`Failed to ${method} to dev.to: ${response.statusText}`);

  // Get the article data from the response
  const articleData = await response.json();

  // Send to Slack webhook
  const slackResponse = await fetch(process.env.SLACK_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      msg: `New article published on dev.to: ${articleData.url}`,
    }),
  });

  if (!slackResponse.ok) {
    console.warn(`Failed to send Slack notification: ${slackResponse.statusText}`);
  }
}

module.exports = postDevTo;
