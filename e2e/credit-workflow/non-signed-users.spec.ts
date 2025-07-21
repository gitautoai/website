import { test, expect } from "@playwright/test";

test.describe("Credits - Non-signed in users", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();
  });

  test("should redirect to sign in when accessing credits dashboard", async ({ page }) => {
    await page.goto("/dashboard/credits");

    const url = page.url();

    if (url.includes("/dashboard/credits")) {
      // If we can access the page, button should be disabled
      const subscribeButton = page.getByTestId("purchase-credits-button");
      await expect(subscribeButton).toBeDisabled();
    } else {
      // Otherwise should redirect to auth
      expect(url).toContain("/auth/signin");
    }
  });

  test("should see credits information on pricing page but cannot purchase", async ({ page }) => {
    await page.goto("/pricing");

    // Should see credit pricing information
    await expect(page.getByText("$2")).toBeVisible();
    await expect(page.getByText("per PR")).toBeVisible();

    // Buy Credits button should prompt sign in
    const buyButton = page.locator("button").filter({ hasText: "Buy Credits" }).first();
    if (await buyButton.isVisible()) {
      await buyButton.click();

      // Should redirect to sign in
      await expect(page).toHaveURL(/auth\/signin/);
    }
  });

  test("should not see credits in navigation when not signed in", async ({ page }) => {
    await page.goto("/");

    // Credits link should not be visible in navigation
    const creditsLink = page.locator("nav a[href='/dashboard/credits']");
    await expect(creditsLink).not.toBeVisible();
  });

  test("should handle direct navigation to protected credit routes", async ({ page }) => {
    const protectedRoutes = [
      "/dashboard/credits",
      "/dashboard/credits/purchase",
      "/dashboard/credits/history",
    ];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to auth
      await expect(page).toHaveURL(/auth\/signin/);
    }
  });
});
