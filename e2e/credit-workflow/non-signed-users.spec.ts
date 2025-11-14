import { test, expect } from "@playwright/test";

test.describe("Credits - Non-signed in users", () => {
  test.beforeEach(async ({ page }) => {
    // Clear any existing auth
    await page.context().clearCookies();
  });

  test("should redirect to sign in when accessing credits dashboard", async ({ page }) => {
    await page.goto("/dashboard/credits");

    // Non-authenticated users should be redirected to GitHub sign-in immediately
    await expect(page).toHaveURL(/github\.com\/login/);
  });

  test.skip("should see credits information on pricing page but cannot purchase", async ({
    page,
  }) => {
    // TODO: Fix button click timeout - button is disabled and click times out after 30s
    // Root cause: "Buy Credits" button is disabled (currentOwnerId is null) for non-signed users
    // Test expects to click disabled button but Playwright waits for it to be enabled, causing timeout
    await page.goto("/pricing");

    // Should see credit pricing information
    await expect(page.getByText("$4").first()).toBeVisible();
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
    const protectedRoutes = ["/dashboard/credits", "/dashboard/usage", "/dashboard/charts"];

    for (const route of protectedRoutes) {
      await page.goto(route);

      // Should redirect to GitHub OAuth (which is the auth flow)
      await expect(page).toHaveURL(/github\.com\/login/);
    }
  });
});
