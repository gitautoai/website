import fs from "fs";
import path from "path";

export async function getBlogPosts() {
  // Ex) /Users/rwest/Repositories/website/app/blog
  const postsDirectory = path.join(process.cwd(), "app", "blog");
  // [ 'layout.tsx', 'page.tsx', 'what-are-dora-metrics' ]
  const directories = fs.readdirSync(postsDirectory);

  const results = await Promise.allSettled(
    directories
      .filter((dir) => {
        if (dir.endsWith(".tsx")) return false;
        return fs.statSync(path.join(postsDirectory, dir)).isDirectory();
      })
      .map(async (dir) => {
        const slug = dir;
        const filePath = path.join(postsDirectory, dir, "page.mdx");
        const fileContent = fs.readFileSync(filePath, "utf8");

        try {
          const metadataMatch = fileContent.match(/export const metadata = ({[\s\S]*?});/);
          if (!metadataMatch) throw new Error(`No metadata export found in ${dir}`);
          const metadata = eval(`(${metadataMatch[1]})`);

          if (!metadata?.title) throw new Error(`title is missing in ${dir}`);
          if (!metadata?.createdAt) throw new Error(`date is missing in ${dir}`);
          if (!metadata?.excerpt) throw new Error(`excerpt is missing in ${dir}`);
          return { slug, ...metadata };
        } catch (error) {
          console.error(`Error processing ${dir}:`, error);
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
