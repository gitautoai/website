/**
 * Checks if the PR contains a blog post and returns relevant information
 */
async function getBlogInfo({ github, context }) {
  const { data: files } = await github.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number,
  });

  let isBlog = false;
  let postUrl = "https://gitauto.ai";

  for (const file of files) {
    // Check for blog posts in app/blog/posts/*.mdx
    if (file.filename.startsWith("app/blog/posts/") && file.filename.endsWith(".mdx")) {
      isBlog = true;
      // Extract slug from filename: "2025-08-07-why-developers-think-unit-tests-waste-time.mdx"
      // Remove date prefix and .mdx extension to get the slug
      const filename = file.filename.split("/").pop();
      const slug = filename.replace(/^\d{4}-\d{2}-\d{2}-/, "").replace(/\.mdx$/, "");
      postUrl = `https://gitauto.ai/blog/${slug}`;
      break;
    }
  }

  return { isBlog, postUrl };
}

module.exports = { getBlogInfo };
