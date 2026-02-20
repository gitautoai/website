import fs from "fs";
import path from "path";

export async function getBlogPostFromPosts(slug: string) {
  const postsDirectory = path.join(process.cwd(), "app", "blog", "posts");
  
  if (!fs.existsSync(postsDirectory)) return null;

  // Check all .mdx files to find one with matching slug in metadata
  const files = fs.readdirSync(postsDirectory).filter(file => file.endsWith('.mdx'));
  
  for (const file of files) {
    const filePath = path.join(postsDirectory, file);
    
    try {
      const fileContent = fs.readFileSync(filePath, "utf8");
      const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/);

      if (!metadataMatch) continue;

      const metadata = eval(`(${metadataMatch[1]})`);

      if (!metadata?.title || !metadata?.createdAt || !metadata?.description) continue;

      // Check if this file matches the requested slug
      const fileSlug = metadata.slug || file.replace('.mdx', '');
      if (fileSlug === slug) {
        return { slug, filename: file.replace('.mdx', ''), ...metadata };
      }
    } catch (error) {
      console.error(`Error processing blog post ${file}:`, error);
      continue;
    }
  }

  return null;
}
