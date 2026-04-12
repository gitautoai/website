const fs = require("fs");
const notifySlack = require("./notify-slack.js");
const path = require("path");

/**
 * Extracts blog post files from the PR associated with the workflow_run event.
 * Triggered after "Deploy to Vercel" completes so images are live.
 */
async function getChangedPostFiles(github, context) {
  const headSha = context.payload.workflow_run.head_sha;
  const { data: prs } = await github.rest.repos.listPullRequestsAssociatedWithCommit({
    owner: context.repo.owner,
    repo: context.repo.repo,
    commit_sha: headSha,
  });

  if (prs.length === 0) {
    console.log("No PR found for commit, skipping");
    return [];
  }

  const { data: files } = await github.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: prs[0].number,
  });

  return files
    .filter((f) => f.filename.startsWith("app/blog/posts/") && f.filename.endsWith(".mdx"))
    .filter((f) => f.status !== "removed")
    .map((f) => f.filename);
}

/**
 * @see https://developers.forem.com/api/v1#operation/createArticle
 */
async function postOneToDevTo(filePath) {
  const filename = filePath
    .split("/")
    .pop()
    .replace(/\.mdx$/, "");
  const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "");
  const postUrl = `https://gitauto.ai/blog/${slug}`;
  const blogPath = path.join(process.cwd(), filePath);
  const imageUrl = `https://gitauto.ai/og/blog/${slug}.png`;
  console.log({ slug, blogPath, imageUrl });

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
      main_image: imageUrl,
      tags: metadata.tags
        .map((tag) => tag.toLowerCase())
        .map((tag) => tag.replace(/[^a-z0-9]/g, "")) // Remove non-alphanumeric characters from tags because dev.to doesn't support them
        .filter((tag) => tag.length > 0)
        .filter((tag) => !["solution", "casestudy"].includes(tag)) // Remove "solution" and "casestudy" tags
        .slice(0, 4), // dev.to limits tags to 4 because dev.to limits 4 tags
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
  // Strip UTM parameters for comparison
  const stripUtm = (url) => url?.split("?")[0];
  const existingArticle = articles.find(
    (a) => stripUtm(a.canonical_url) === stripUtm(newArticle.article.canonical_url),
  );

  // Update or create the article
  const endpoint = existingArticle
    ? `https://dev.to/api/articles/${existingArticle.id}`
    : "https://dev.to/api/articles";
  const method = existingArticle ? "PUT" : "POST";
  const body = JSON.stringify(newArticle);
  const response = await fetch(endpoint, { method, headers, body });

  if (!response.ok) {
    const errorDetail = await response.json();
    console.error("Dev.to API Error:", {
      status: response.status,
      statusText: response.statusText,
      error: errorDetail,
      article: newArticle,
    });
    throw new Error(`Failed to ${method} to dev.to: ${response.statusText}`);
  }

  // Get the article data from the response
  const articleData = await response.json();

  await notifySlack(`Posted to dev.to! ${articleData.url}`);
}

async function postDevTo({ github, context }) {
  const files = await getChangedPostFiles(github, context);
  for (const filePath of files) {
    await postOneToDevTo(filePath);
  }
}

module.exports = postDevTo;
