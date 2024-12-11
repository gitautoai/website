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
  await page.setViewportSize({ width: 1024, height: 768 });

  for (const url of urls) {
    const urlObj = new URL(url);
    const fullPath = `${urlObj.hostname}${urlObj.pathname}`;
    const fileName = `${encodeURIComponent(fullPath)}.png`;
    const filePath = path.join(outputDir, fileName);

    console.log(`Taking screenshot of ${url} and saving to ${filePath}`);
    try {
      // Add timeout and wait for network idle
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

      // Wait for content to be visible
      // await page.waitForSelector("#root", { state: "visible", timeout: 30000 });

      // Add a small delay to ensure dynamic content loads
      await page.waitForTimeout(10000);

      // Check for error states
      // const hasError = await page.evaluate(() => {
      //   return (
      //     !!document.querySelector(".error-404") ||
      //     !document.querySelector("#root")?.children.length
      //   );
      // });
      // if (hasError) throw new Error("Page loaded with errors");

      await page.screenshot({ path: filePath, fullPage: true });
      console.log(`Successfully captured screenshot for ${url}`);
    } catch (error) {
      console.error(`Failed to take screenshot of ${url}:`, error.message);
      // Continue with next URL instead of stopping
    }
  }

  await browser.close();
})();
