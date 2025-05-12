import { test, expect } from "@playwright/test";
import { ABSOLUTE_URLS } from "@/config";

test.describe("Install Button", () => {
  test("navigates to GitHub installation page", async ({ page, context }) => {
    // Start intercepting network requests before navigating
    await page.route("**/*", (route) => {
      return route.continue();
    });

    // Go to homepage
    await page.goto("/");

    // Find the install button
    const installButton = page.getByRole("link", { name: /Install/i });
    
    // Verify button attributes
    await expect(installButton).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    await expect(installButton).toHaveAttribute("target", "_blank");

    // Verify the button is visible and has the GitHub icon
    await expect(installButton).toBeVisible();
    await expect(installButton.locator('img[alt="Github Logo"]')).toBeVisible();

    // Wait for the new page to be created when clicking the button
    const pagePromise = context.waitForEvent("page");
    await installButton.click();
    const newPage = await pagePromise;
    await newPage.waitForLoadState();

    // Verify we're on the GitHub installation page
    expect(newPage.url()).toBe(ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);

    // Close the new page
    await newPage.close();
  });
});