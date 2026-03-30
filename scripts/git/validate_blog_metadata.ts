// Validates blog post metadata lengths match createPageMetadata constraints.
// Blog layout builds title as: `${post.title} - GitAuto Blog`
// createPageMetadata validates: title 50-60 chars, description 110-160 chars.
// Only checks staged blog posts to avoid blocking on pre-existing issues.
import { execSync } from "child_process";
import { readFileSync } from "fs";
import { join } from "path";

const BLOG_DIR = "app/blog/posts";
const SUFFIX = " - GitAuto Blog"; // From layout.tsx: `${post.title} - ${PRODUCT_NAME} Blog`
const TITLE_MIN = 50;
const TITLE_MAX = 60;
const DESC_MIN = 110;
const DESC_MAX = 160;

// Get staged .mdx files in blog posts dir
const staged = execSync("git diff --cached --name-only --diff-filter=d", {
  encoding: "utf-8",
})
  .split("\n")
  .filter((f) => f.startsWith(BLOG_DIR) && f.endsWith(".mdx"));

if (staged.length === 0) {
  console.log("No staged blog posts to validate");
  process.exit(0);
}

let hasError = false;

for (const relPath of staged) {
  const file = relPath.split("/").pop()!;
  const content = readFileSync(relPath, "utf-8");

  // Extract title from metadata
  const titleMatch = content.match(/title:\s*"([^"]+)"/);
  if (!titleMatch) {
    console.error(`${file}: could not extract title`);
    hasError = true;
    continue;
  }
  const title = titleMatch[1];
  const fullTitle = title + SUFFIX;
  if (fullTitle.length < TITLE_MIN || fullTitle.length > TITLE_MAX) {
    console.error(
      `${file}: meta title "${fullTitle}" is ${fullTitle.length} chars (must be ${TITLE_MIN}-${TITLE_MAX}). Adjust metadata.title (currently ${title.length} chars, needs ${TITLE_MIN - SUFFIX.length}-${TITLE_MAX - SUFFIX.length}).`
    );
    hasError = true;
  }

  // Extract description from metadata (may span multiple lines)
  const descMatch = content.match(/description:\s*\n?\s*"([^"]+)"/);
  if (!descMatch) {
    console.error(`${file}: could not extract description`);
    hasError = true;
    continue;
  }
  const desc = descMatch[1];
  if (desc.length < DESC_MIN || desc.length > DESC_MAX) {
    console.error(
      `${file}: meta description is ${desc.length} chars (must be ${DESC_MIN}-${DESC_MAX}).`
    );
    hasError = true;
  }
}

if (hasError) {
  process.exit(1);
}
console.log(`Blog metadata lengths OK (${staged.length} post(s) checked)`);
