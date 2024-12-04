import { chromium } from "playwright";
import fs from "fs";
import path from "path";

(async () => {
  // Specify the output directory on GitHub Actions
  const outputDir = process.argv[2];
  if (!outputDir) {
    console.error("Specify the output directory on GitHub Actions");
    process.exit(1);
  }

  const baseUrl = process.argv[3];
  if (!baseUrl) {
    console.error("Specify the base URL");
    process.exit(1);
  }

  // URLs to take screenshots of
  const urls = [
    `${baseUrl}`,
    `${baseUrl}/blog`,
    // `${baseUrl}/settings`,
    // `${baseUrl}/settings/integrations`,
    `${baseUrl}/settings/integrations/jira`,
  ];

  // Create the output directory if it doesn't exist
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  // Launch the browser
  const browser = await chromium.launch();
  const context = await browser.newContext(); // A new browser window
  const page = await context.newPage(); // A new tab in the browser window

  for (const url of urls) {
    const fileName = `${path.basename(url)}.png`.replace(/[^\w.-]/g, "_");
    await page.goto(url, { waitUntil: "networkidle" }); // Wait for the page to load
    await page.screenshot({ path: path.join(outputDir, fileName) }); // Take a screenshot
  }

  await browser.close();
})();
