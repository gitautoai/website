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
  const context = await browser.newContext({
    viewport: { width: 1024, height: 768 },
    deviceScaleFactor: 2,
  }); // A new browser window
  const page = await context.newPage(); // A new tab in the browser window

  for (const url of urls) {
    // Use full URL path and encode it for safe filename
    const urlObj = new URL(url);
    const fullPath = `${urlObj.hostname}${urlObj.pathname}`;
    const fileName = `${encodeURIComponent(fullPath)}.png`;
    const filePath = path.join(outputDir, fileName);

    console.log(`Taking screenshot of ${url} and saving to ${filePath}`);
    await page.goto(url, { waitUntil: "networkidle" }); // Wait for the page to load
    await page.screenshot({ path: filePath, fullPage: true }); // Take a screenshot
  }

  await browser.close();
})();
