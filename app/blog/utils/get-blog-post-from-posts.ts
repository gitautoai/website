import fs from "fs";
import path from "path";

export async function getBlogPostFromPosts(slug: string) {
  const filePath = path.join(process.cwd(), "app", "blog", "posts", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/);

    if (!metadataMatch) return null;

    const metadata = eval(`(${metadataMatch[1]})`);

    if (!metadata?.title || !metadata?.createdAt || !metadata?.description) return null;

    return { slug, ...metadata };
  } catch (error) {
    console.error(`Error processing blog post ${slug}:`, error);
    return null;
  }
}
