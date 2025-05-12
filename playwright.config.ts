import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: "http://localhost:4000",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
        headless: true,
      },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:4000",
    reuseExistingServer: false,
    timeout: 120000,
  },
});
