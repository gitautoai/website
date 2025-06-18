import fs from "fs";
import path from "path";

export async function getBlogPosts() {
  const postsDirectory = path.join(process.cwd(), "app", "blog", "posts");

  if (!fs.existsSync(postsDirectory)) return [];

  const files = fs.readdirSync(postsDirectory);

  const results = await Promise.allSettled(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const slug = file.replace(".mdx", "");
        const filePath = path.join(postsDirectory, file);
        const fileContent = fs.readFileSync(filePath, "utf8");

        try {
          const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/);
          if (!metadataMatch) throw new Error(`No metadata export found in ${file}`);
          const metadata = eval(`(${metadataMatch[1]})`);

          if (!metadata?.title || !metadata?.createdAt || !metadata?.description)
            throw new Error(`Required metadata missing in ${file}`);

          return { slug, ...metadata };
        } catch (error) {
          console.error(`Error processing ${file}:`, error);
          return null;
        }
      })
  );

  const posts = results
    .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
    .map((result) => result.value)
    .filter((post) => post !== null);

  return posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}
