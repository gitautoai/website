import { test, expect } from '@playwright/test';

test.describe('Auto-reload workflow', () => {
  test.beforeEach(async ({ page }) => {
    // Login as test user
    await page.goto('/');
    await page.getByRole('button', { name: 'Sign in with GitHub' }).click();
    await page.waitForURL('/dashboard');
  });

  test('should configure and trigger auto-reload', async ({ page }) => {
    // Navigate to credits page
    await page.goto('/dashboard/credits');
    
    // Configure auto-reload settings
    await test.step('Configure auto-reload', async () => {
      const autoReloadSection = page.getByTestId('auto-reload-settings');
      
      // Enable auto-reload
      await autoReloadSection.getByRole('button', { name: 'Enable Auto-Reload' }).click();
      
      // Set threshold to $10
      await autoReloadSection.getByLabel('When credit balance reaches:').fill('10');
      
      // Set target to $50
      await autoReloadSection.getByLabel('Bring credit balance back up to:').fill('50');
      
      // Save settings
      await autoReloadSection.getByRole('button', { name: 'Save Settings' }).click();
      
      // Verify success message or state change
      await expect(autoReloadSection.getByText('Auto-reload settings saved')).toBeVisible();
    });

    // Simulate low balance by using credits
    await test.step('Deplete credits below threshold', async () => {
      // This would normally be done by generating PRs
      // For testing, we'll use a test endpoint or database manipulation
      await page.evaluate(async () => {
        // Mock API call to reduce credits
        await fetch('/api/test/deplete-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetBalance: 5 }),
        });
      });
    });

    // Trigger auto-reload cron job
    await test.step('Trigger auto-reload check', async () => {
      const response = await page.request.get('/api/cron/auto-reload', {
        headers: {
          'Authorization': `Bearer ${process.env.CRON_SECRET}`,
        },
      });
      
      expect(response.ok()).toBeTruthy();
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.processed).toBeGreaterThan(0);
    });

    // Verify credits were added
    await test.step('Verify credit balance updated', async () => {
      await page.reload();
      
      // Check new balance
      const balanceElement = page.getByTestId('credit-balance');
      await expect(balanceElement).toContainText('$50');
      
      // Check transaction history
      const transactionHistory = page.getByTestId('transaction-history');
      await expect(transactionHistory).toContainText('Auto-reload');
      await expect(transactionHistory).toContainText('+$45');
    });
  });

  test('should not trigger auto-reload when disabled', async ({ page }) => {
    await page.goto('/dashboard/credits');
    
    // Ensure auto-reload is disabled
    const autoReloadSection = page.getByTestId('auto-reload-settings');
    const toggleButton = autoReloadSection.getByRole('button');
    
    // If enabled, disable it
    const isEnabled = await toggleButton.getAttribute('aria-checked') === 'true';
    if (isEnabled) {
      await toggleButton.click();
    }
    
    // Deplete credits
    await page.evaluate(async () => {
      await fetch('/api/test/deplete-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetBalance: 5 }),
      });
    });
    
    // Trigger cron job
    const response = await page.request.get('/api/cron/auto-reload', {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    });
    
    expect(response.ok()).toBeTruthy();
    
    // Verify balance didn't change
    await page.reload();
    const balanceElement = page.getByTestId('credit-balance');
    await expect(balanceElement).toContainText('$5');
  });

  test('should respect auto-reload thresholds', async ({ page }) => {
    await page.goto('/dashboard/credits');
    
    // Configure auto-reload with threshold of $10
    const autoReloadSection = page.getByTestId('auto-reload-settings');
    await autoReloadSection.getByRole('button', { name: 'Enable Auto-Reload' }).click();
    await autoReloadSection.getByLabel('When credit balance reaches:').fill('10');
    await autoReloadSection.getByLabel('Bring credit balance back up to:').fill('50');
    await autoReloadSection.getByRole('button', { name: 'Save Settings' }).click();
    
    // Set balance to $15 (above threshold)
    await page.evaluate(async () => {
      await fetch('/api/test/set-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: 15 }),
      });
    });
    
    // Trigger cron job
    const response = await page.request.get('/api/cron/auto-reload', {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    });
    
    const data = await response.json();
    expect(data.success).toBe(true);
    
    // Verify balance didn't change (still above threshold)
    await page.reload();
    const balanceElement = page.getByTestId('credit-balance');
    await expect(balanceElement).toContainText('$15');
  });
});