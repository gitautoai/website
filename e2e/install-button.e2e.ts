import { test, expect } from "@playwright/test";
import { ABSOLUTE_URLS } from "@/config";

test.describe("Install Button", () => {
  test("should navigate to GitHub installation page", async ({ page }) => {
    // Start intercepting network requests before navigating
    await page.route("**/*", (route) => {
      return route.continue();
    });

    // Go to homepage where the Install button is present
    await page.goto("/");

    // Find the Install button by its text content
    const installButton = page.getByRole("link", { name: /Get Started for Free/i });

    // Verify button attributes
    await expect(installButton).toHaveAttribute("href", ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
    await expect(installButton).toHaveAttribute("target", "_blank");

    // Verify button styling
    await expect(installButton).toHaveClass(/bg-pink-600/);
    await expect(installButton).toHaveClass(/text-white/);
    await expect(installButton).toHaveClass(/rounded-xl/);

    // Verify GitHub logo is present
    const githubLogo = page.getByAltText("Github Logo");
    await expect(githubLogo).toBeVisible();
    await expect(githubLogo).toHaveAttribute("src", "/icons/github.svg");

    // Click the button and verify navigation
    const [newPage] = await Promise.all([
      page.waitForEvent("popup"),
      installButton.click(),
    ]);
    expect(newPage.url()).toBe(ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO);
  });
});