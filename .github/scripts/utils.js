/**
 * Checks if the PR contains a blog post and returns relevant information
 */
async function getBlogInfo({ github, context }) {
  const files = await github.rest.pulls.listFiles({
    owner: context.repo.owner,
    repo: context.repo.repo,
    pull_number: context.payload.pull_request.number,
  });

  let isBlog = false;
  let postUrl = `https://gitauto.ai`;

  for (const file of files.data) {
    if (file.filename.startsWith("app/blog/") && file.filename.endsWith("page.mdx")) {
      isBlog = true;
      const slug = file.filename.split("/")[2];
      postUrl = `https://gitauto.ai/blog/${slug}`;
      break;
    }
  }

  return { isBlog, postUrl };
}

module.exports = { getBlogInfo };
