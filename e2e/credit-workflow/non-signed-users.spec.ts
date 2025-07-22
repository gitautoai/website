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
      // If we can access the page, clicking Buy Credits should redirect to sign in
      const subscribeButton = page.getByTestId("purchase-credits-button");
      await expect(subscribeButton).toBeVisible();
      await subscribeButton.click();

      // Should redirect to GitHub OAuth (which is the auth flow)
      await expect(page).toHaveURL(/github\.com\/login/);
    } else {
      // Otherwise should redirect to GitHub OAuth immediately
      expect(url).toContain("github.com/login");
    }
  });

  test("should see credits information on pricing page but cannot purchase", async ({ page }) => {
    await page.goto("/pricing");

    // Should see credit pricing information
    await expect(page.getByText("$2").first()).toBeVisible();
    await expect(page.getByText("per PR").first()).toBeVisible();

    // Buy Credits button should show modal when clicked
    const buyButton = page.locator("button").filter({ hasText: "Buy Credits" }).first();
    if (await buyButton.isVisible()) {
      await buyButton.click();

      // Should show purchase modal
      await expect(page.getByRole("heading", { name: "Purchase Credits" })).toBeVisible();

      // Clicking "Purchase Credits" in modal should redirect to GitHub OAuth
      const purchaseButton = page.getByRole("button", { name: "Purchase Credits", exact: true });
      await purchaseButton.click();

      // Should redirect to GitHub OAuth (which is the auth flow)
      await expect(page).toHaveURL(/github\.com\/login/);
    }
  });

  test("should not see credits in navigation when not signed in", async ({ page }) => {
    await page.goto("/");

    // Credits link should not be visible in navigation
    const creditsLink = page.locator("nav a[href='/dashboard/credits']");
    await expect(creditsLink).not.toBeVisible();
  });

  test("should handle direct navigation to protected credit routes", async ({ page }) => {
    const protectedRoutes = ["/dashboard/credits"];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to GitHub OAuth (which is the auth flow)
      await expect(page).toHaveURL(/github\.com\/login/);
    }
  });
});
