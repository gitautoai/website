import { test, expect } from "@playwright/test";

test.describe("Credits - Legacy subscription owners", () => {
  // These tests use Playwright's built-in authentication state
  test.use({ storageState: "e2e/.auth/legacy-with-subscription.json" });

  test.beforeEach(async ({ page }) => {
    // Set up API mocks for legacy user with subscription
    await page.route('**/api/auth/session', (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify({
          userId: 12345,
          user: {
            id: '12345',
            name: 'Test Legacy User',
            email: 'legacy@test.com',
            login: 'legacy-user',
            userId: 12345
          },
          jwtToken: 'test-jwt-token',
          accessToken: 'test-access-token'
        })
      });
    });

    await page.route('**/api/users/get-user-info', (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 12345,
          account: { login: 'legacy-org', type: 'Organization' },
          owner_id: 12345,
          owner_type: 'Organization',
          stripe_customer_id: 'cus_legacy123'
        }])
      });
    });

    await page.route('**/api/stripe/get-userinfo-subscriptions', (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([true]) // Has active subscription
      });
    });

    await page.route('**/api/github/get-installed-repos', (route) => {
      route.fulfill({
        contentType: 'application/json',
        body: JSON.stringify([{
          ownerId: 12345,
          ownerName: 'legacy-org',
          ownerType: 'Organization',
          repositories: [{
            repoId: 1,
            repoName: 'legacy-repo'
          }]
        }])
      });
    });

    // Set localStorage to select the organization
    await page.addInitScript(() => {
      localStorage.setItem('gitauto-currentOwnerName', 'legacy-org');
      localStorage.setItem('gitauto-currentRepoName', 'legacy-repo');
    });
  });

  test("should show subscription management for legacy customers with active subscription", async ({
    page,
  }) => {
    await page.goto("/pricing");

    // Should show "Manage" button for legacy customers with subscription
    const manageButton = page.locator("button").filter({ hasText: "Manage" });
    await expect(manageButton).toBeVisible();

    // Should not show "Buy Credits" button
    const buyCreditsButton = page.locator("button").filter({ hasText: "Buy Credits" });
    await expect(buyCreditsButton).not.toBeVisible();
  });

  test("should still show credits dashboard for legacy customers", async ({ page }) => {
    await page.goto("/dashboard/credits");

    // Legacy customers should still be able to access credits dashboard
    await expect(page.locator("h1")).toContainText("Credits Management");

    // Should show their credit balance (might be $0 if they haven't purchased credits)
    await expect(page.locator("[data-testid=credit-balance-card]")).toBeVisible();
  });

  test("should allow legacy customers to purchase credits for future use", async ({ page }) => {
    await page.goto("/dashboard/credits");

    // Legacy customers should be able to buy credits (for when subscription expires)
    const purchaseButton = page.locator("[data-testid=purchase-credits-button]");
    await expect(purchaseButton).toBeVisible();

    await purchaseButton.click();

    // Should redirect to purchase flow
    await page.waitForTimeout(1000);
    await expect(page.url()).toMatch(/checkout|stripe/);
  });

  test("should show different pricing model information", async ({ page }) => {
    await page.goto("/dashboard/credits");

    // Should explain that they're currently on subscription
    await expect(page.locator("text=subscription")).toBeVisible();

    // Should still show credit pricing for future reference
    await expect(page.locator("text=$2")).toBeVisible();
    await expect(page.locator("text=per PR")).toBeVisible();
  });

  test.describe("Legacy owner without subscription", () => {
    // This test suite would use a different auth state for expired subscription
    test.use({ storageState: "e2e/.auth/legacy-no-subscription.json" });

    test("should handle subscription expiration scenario", async ({ page }) => {
      await page.goto("/pricing");

      // After subscription expires, should show "Buy Credits" instead
      const buyCreditsButton = page.locator("button").filter({ hasText: "Buy Credits" });
      await expect(buyCreditsButton).toBeVisible();

      // Should not show subscription management
      const manageButton = page.locator("button").filter({ hasText: "Manage Subscription" });
      await expect(manageButton).not.toBeVisible();
    });

    test("should transition from subscription to credits smoothly", async ({ page }) => {
      await page.goto("/dashboard/coverage");

      // Legacy customer with active subscription should still be able to create PRs
      const createIssuesButton = page.locator("[data-testid=create-issues-button]");

      if (await createIssuesButton.isVisible()) {
        await createIssuesButton.click();

        // Should work without deducting credits (subscription covers it)
        await expect(page.locator("text=insufficient")).not.toBeVisible();
      }
    });

    test("should see Manage button and open portal when has active subscription", async ({
      page,
    }) => {
      // This is the key test from comprehensive - legacy with subscription sees "Manage"
      await page.goto("/dashboard/credits");

      const subscribeButton = page.getByTestId("purchase-credits-button");
      await expect(subscribeButton).toHaveText("Manage");

      // Mock Stripe portal URL
      await page.route("**/api/stripe/create-portal-or-checkout-url", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify("https://billing.stripe.com/p/session/test_portal"),
        });
      });

      // Click should open portal (not checkout)
      const popupPromise = page.waitForEvent("popup");
      await subscribeButton.click();

      const popup = await popupPromise;
      expect(popup.url()).toContain("billing.stripe.com/p/session");
    });

    test("should allow configuring auto-reload for future use", async ({ page }) => {
      await page.goto("/dashboard/credits");

      // Legacy customers should be able to set up auto-reload for when subscription ends
      const autoReloadSection = page.locator("[data-testid=auto-reload-settings]");
      await expect(autoReloadSection).toBeVisible();

      const enableCheckbox = autoReloadSection.locator("input[type=checkbox]");
      await enableCheckbox.check();

      // Should save successfully
      const saveButton = autoReloadSection.locator("button");
      await saveButton.click();
      await expect(saveButton).toContainText("Saving...");
    });
  });
});
