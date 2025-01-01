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
    console.log(file.filename);
    if (file.filename.startsWith("app/blog/") && file.filename.endsWith("page.mdx")) {
      isBlog = true;
      console.log("isBlog", isBlog);
      const slug = file.filename.split("/")[2];
      postUrl = `https://gitauto.ai/blog/${slug}`;
      break;
    }
  }

  console.log("isBlog", isBlog);
  console.log("postUrl", postUrl);
  return { isBlog, postUrl };
}

module.exports = { getBlogInfo };
