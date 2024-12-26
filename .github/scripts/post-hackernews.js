const { chromium } = require("playwright");

/**
 * Posts to Hacker News using Playwright for browser automation
 */
async function postHackerNews({ context, isBlog, postUrl }) {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Login to HN - specifically target the login form (not the create account form)
    await page.goto("https://news.ycombinator.com/login");
    await page.waitForLoadState("networkidle");

    // Because there are login and create account forms, we need to target the login form specifically
    const loginForm = page.locator('form[action="login"]:not(:has(input[name="creating"]))');
    await loginForm.locator('input[name="acct"]').fill(process.env.HN_USERNAME);
    await loginForm.locator('input[name="pw"]').fill(process.env.HN_PASSWORD);
    await loginForm.locator('input[type="submit"]').click();

    // Wait for login to complete (look for a logout link)
    await page.waitForSelector('a[href^="logout"]', { timeout: 10000 }); // Use href^= to match links that start with "logout"

    // Navigate to submit page and wait for it to load
    await page.goto("https://news.ycombinator.com/submit");
    await page.waitForLoadState("networkidle");

    // Submit story
    await page.fill('input[name="title"]', context.payload.pull_request.title);
    await page.fill('input[name="url"]', `${postUrl}?utm_source=hackernews&utm_medium=referral`);
    await page.click('input[type="submit"]');
    await page.waitForLoadState("networkidle");

    // Wait for either an error message or successful submission
    await Promise.race([
      page.waitForSelector(".error", { timeout: 5000 }),
      page.waitForURL(/item\?id=\d+/, { timeout: 5000 }),
    ]);

    // Check if there was an error
    const error = await page
      .locator(".error")
      .first()
      .textContent()
      .catch(() => null);
    if (error) throw new Error(`HN submission failed: ${error}`);

    await browser.close();
  } catch (error) {
    await browser.close();
    throw error;
  }
}

module.exports = postHackerNews;
