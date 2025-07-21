import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

// Load environment variables from .env.local for E2E tests
config({ path: ".env.local" });

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",

  // Global setup/teardown: runs ONCE for entire test suite (starts/stops Stripe webhook)
  // require.resolve() converts relative path to absolute path for Playwright to load dynamically
  globalSetup: require.resolve("./e2e/setup/stripe.setup.ts"),
  globalTeardown: require.resolve("./e2e/setup/stripe.teardown.ts"),
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: !!process.env.CI,
  },
  projects: [
    // Project setup: runs auth.setup.ts to create auth state files before tests
    {
      name: "setup",
      testMatch: ["e2e/setup/auth.setup.ts"],
    },
    // Browser tests depend on setup
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
      },
      dependencies: ["setup"],
    },
  ],
  webServer: process.env.CI
    ? undefined
    : {
        command: "npm run dev:test",
        url: "http://localhost:4000",
        reuseExistingServer: true,
        timeout: 120000,
      },
});
