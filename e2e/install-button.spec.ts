import { test, expect } from "@playwright/test";
import { ABSOLUTE_URLS } from "@/config";

test.describe("Install Button", () => {
  test("navigates to GitHub installation page", async ({ page }) => {
    // Start intercepting network requests before navigating
    await page.route("**/*", (route) => {
      return route.continue();
    });

    // Go to homepage
    await page.goto("/");

    // Find and click the install button
    const installButton = page.getByRole("link", { name: /Install/i });
    
    // Verify button attributes
    await expect(installButton).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    await expect(installButton).toHaveAttribute("target", "_blank");

    // Verify the button is visible and has the GitHub icon
    await expect(installButton).toBeVisible();
    await expect(page.getByAltText("Github Logo")).toBeVisible();
  });
});