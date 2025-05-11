import { test, expect } from "@playwright/test";

test.describe("Website accessibility and basic functionality", () => {
  test("homepage loads successfully", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Check if the page loaded successfully
    await expect(page).toHaveTitle(/GitAuto/);

    // Check if main content is visible
    await expect(page.locator("main")).toBeVisible();
  });

  test("navigation works", async ({ page }) => {
    // Navigate to the homepage
    await page.goto("/");

    // Check if navigation links are visible
    const navLinks = page.locator("nav a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);

    // Click the first navigation link and verify it works
    const firstLink = navLinks.first();
    const href = await firstLink.getAttribute("href");
    await firstLink.click();

    // Verify we navigated to the correct page
    await expect(page).toHaveURL(new RegExp(href || ""));
  });
});
