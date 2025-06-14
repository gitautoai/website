import fs from "fs";
import { glob } from "glob";
import path from "path";
import { chromium } from "playwright";

async function findAllPages() {
  const pageFiles = await glob("app/**/page.tsx", {
    ignore: ["app/api/**", "app/components/**"],
  });

  const pages = [];

  for (const file of pageFiles) {
    // Generate the route path: app/pricing/page.tsx → /pricing
    const routePath = file.replace("app", "").replace("/page.tsx", "").replace(/^$/, "/"); // Empty string is '/'

    // Generate the file name: /pricing → pricing, / → home
    const fileName = routePath === "/" ? "home" : routePath.slice(1).replace(/\//g, "-");

    // Read the metadata (optional)
    const pageContent = fs.readFileSync(file, "utf8");
    const titleMatch = pageContent.match(/title:\s*["']([^"']+)["']/);
    const title = titleMatch ? titleMatch[1] : `GitAuto ${fileName}`;

    pages.push({ name: fileName, path: routePath, title: title, file: file });
  }

  return pages;
}

async function generateOGImages() {
  const browser = await chromium.launch();
  const baseUrl = "http://localhost:3000";

  // Find all pages automatically
  const pages = await findAllPages();
  console.log(
    `Found ${pages.length} pages:`,
    pages.map((p) => p.path)
  );

  const ogDir = path.join(process.cwd(), "public", "og");
  if (!fs.existsSync(ogDir)) fs.mkdirSync(ogDir, { recursive: true });

  for (const pageConfig of pages) {
    try {
      console.log(`Generating OG image for: ${pageConfig.name} (${pageConfig.path})`);

      const page = await browser.newPage();
      await page.setViewportSize({ width: 1200, height: 630 });

      await page.goto(`${baseUrl}${pageConfig.path}`, {
        waitUntil: "domcontentloaded",
        timeout: 30000,
      });

      // Wait for the main content to load
      await page.waitForSelector("main", { timeout: 10000 });

      const screenshot = await page.screenshot({
        type: "png",
        clip: { x: 0, y: 0, width: 1200, height: 630 },
      });

      const outputPath = path.join(ogDir, `${pageConfig.name}.png`);
      fs.writeFileSync(outputPath, screenshot);
      console.log(`✓ Generated: ${outputPath}`);

      await page.close();
    } catch (error) {
      console.error(`✗ Failed to generate ${pageConfig.name}:`, error.message);
    }
  }

  await browser.close();
  console.log("OG image generation completed!");
}

generateOGImages().catch(console.error);
