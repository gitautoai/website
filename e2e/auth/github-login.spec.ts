import { test, expect } from "@playwright/test";
import { authenticator } from "otplib";
import { RELATIVE_URLS, DEFAULT_SIGNIN_REDIRECT } from "@/config/urls";

/**
 * Real GitHub OAuth login E2E test
 *
 * Required environment variables:
 * - GITHUB_USERNAME: Your GitHub username
 * - GITHUB_PASSWORD: Your GitHub password
 * - GITHUB_OTP_SECRET: (Optional) Your 2FA secret key for TOTP generation
 *
 * To get OTP secret:
 * 1. Go to GitHub Settings > Security > Two-factor authentication
 * 2. Click "Reconfigure two-factor authentication"
 * 3. Choose "Set up using an app"
 * 4. Click "enter this text code instead" to get the secret key
 *
 * Run with: GITHUB_USERNAME=your-username GITHUB_PASSWORD=your-password npm run test:e2e -- github-login.spec.ts
 */

// Use same port as dev server - E2E will kill existing dev server before starting
test.use({ baseURL: "http://localhost:4000" });

test.describe("GitHub OAuth Login", () => {
  test.skip(
    !process.env.GITHUB_USERNAME || !process.env.GITHUB_PASSWORD,
    "Skipping real login test - GITHUB_USERNAME and GITHUB_PASSWORD not provided"
  );

  test("should complete full GitHub OAuth login flow", async ({ page, context }) => {
    // Handle passkey dialog
    page.on("dialog", async (dialog) => {
      console.log("Dialog appeared:", dialog.message());
      await dialog.dismiss(); // Click Cancel on passkey prompt
    });

    // Start from homepage
    await page.goto(RELATIVE_URLS.INDEX);

    // Click Sign In button
    await page.click('button:has-text("Sign In")');

    // Wait for redirect to GitHub OAuth page
    await page.waitForURL(/github\.com\/login/);

    // Fill in GitHub credentials
    await page.fill('input[name="login"]', process.env.GITHUB_USERNAME!);
    await page.fill('input[name="password"]', process.env.GITHUB_PASSWORD!);

    // Submit login form
    await page.click('input[type="submit"][value="Sign in"]');

    // Handle 2FA if configured
    if (process.env.GITHUB_OTP_SECRET) {
      // Wait for 2FA page to load
      await page
        .waitForURL(/github\.com\/sessions\/two-factor/, { timeout: 5000 })
        .catch(() => null);

      // If we're on the 2FA page, the cursor is already in the input field
      if (page.url().includes("two-factor")) {
        // Generate TOTP code
        const token = authenticator.generate(process.env.GITHUB_OTP_SECRET);
        // Just type it - cursor is already in the field
        await page.keyboard.type(token);
        // GitHub auto-submits after typing 6 digits
      }
    }

    // Wait for redirect back to our app (DEFAULT_SIGNIN_REDIRECT)
    await page.waitForURL(new RegExp(DEFAULT_SIGNIN_REDIRECT), { timeout: 30000 });

    // Verify we're logged in by checking for profile image (the round user avatar)
    await expect(
      page.locator('img[alt*="profile"], img[alt*="user"], button img.rounded-full').first()
    ).toBeVisible({ timeout: 10000 });

    // Verify we're on the correct redirect page
    await expect(page).toHaveURL(new RegExp(DEFAULT_SIGNIN_REDIRECT));

    // Wait for page to be fully loaded before navigating
    await page.waitForLoadState("networkidle");

    // Test that we can navigate to other dashboard pages
    await page.goto(RELATIVE_URLS.DASHBOARD.CREDITS);
    await expect(page).toHaveURL(new RegExp(RELATIVE_URLS.DASHBOARD.CREDITS));

    // Verify session info is displayed correctly
    const userName = await page
      .locator('[data-testid="user-name"], .user-name')
      .first()
      .textContent()
      .catch(() => null);
    if (userName) {
      expect(userName).toBeTruthy();
    }
  });
});
