import { test, expect } from "@playwright/test";
import { getCreditBalance } from "@/app/actions/supabase/credits/get-credit-balance";
import { supabaseAdmin } from "@/lib/supabase/server";

test.describe("Manual Credit Purchase", () => {
  const testOwnerId = 12345; // Placeholder - this test needs proper setup
  
  test.beforeEach(async ({ page }) => {
    // Navigate to credits page
    await page.goto("/dashboard/credits");
    
    // Wait for page to load
    await expect(page.getByText("Credits Management")).toBeVisible();
  });

  test("should show success notification after successful payment", async ({ page }) => {
    // Initial balance check
    const initialBalance = await getCreditBalance(testOwnerId);
    
    // Simulate returning from Stripe with success parameter
    await page.goto("/dashboard/credits?success=true");
    
    // 1. Check for success toast notification
    await expect(page.getByText("🎉 Payment successful! Your credits have been added.")).toBeVisible();
    
    // 2. Check for visual celebration effect
    const celebrationElement = await page.locator(".celebration");
    await expect(celebrationElement).toBeVisible();
    
    // 3. Wait for celebration animation to complete
    await page.waitForTimeout(3000);
    await expect(celebrationElement).not.toBeVisible();
    
    // 4. Check that URL parameters are removed
    await expect(page).toHaveURL("/dashboard/credits");
    expect(page.url()).not.toContain("success=true");
    
    // 5. Check that balance is refreshed (should be higher than initial)
    const balanceElement = await page.getByTestId("credit-balance");
    const newBalanceText = await balanceElement.textContent();
    const newBalance = parseInt(newBalanceText?.replace(/[^0-9]/g, "") || "0");
    expect(newBalance).toBeGreaterThan(initialBalance);
  });

  test("should show cancel notification after cancelled payment", async ({ page }) => {
    // Simulate returning from Stripe with cancel parameter
    await page.goto("/dashboard/credits?success=false");
    
    // Check for cancel toast notification
    await expect(page.getByText("Payment was cancelled. No charges were made.")).toBeVisible();
    
    // Check that URL parameters are removed
    await expect(page).toHaveURL("/dashboard/credits");
    expect(page.url()).not.toContain("success=false");
  });

  test("should update database after successful payment", async ({ page }) => {
    // Get initial credit balance from database
    const { data: initialOwner } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId)
      .single();
    
    const initialBalance = initialOwner?.credit_balance_usd || 0;
    
    // Simulate successful payment
    await page.goto("/dashboard/credits?success=true");
    
    // Wait for balance to update
    await page.waitForTimeout(2000);
    
    // Check database for updated balance
    const { data: updatedOwner } = await supabaseAdmin
      .from("owners")
      .select("credit_balance_usd")
      .eq("owner_id", testOwnerId)
      .single();
    
    const updatedBalance = updatedOwner?.credit_balance_usd || 0;
    expect(updatedBalance).toBeGreaterThan(initialBalance);
    
    // Check for new transaction in credits table
    const { data: recentTransaction } = await supabaseAdmin
      .from("credits")
      .select("*")
      .eq("owner_id", testOwnerId)
      .eq("transaction_type", "purchase")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    expect(recentTransaction).toBeTruthy();
    expect(recentTransaction?.amount_usd).toBeGreaterThan(0);
  });

  test("should handle missing success parameter gracefully", async ({ page }) => {
    // Navigate without success parameter
    await page.goto("/dashboard/credits");
    
    // Should not show any notification
    await expect(page.getByText("Payment successful")).not.toBeVisible();
    await expect(page.getByText("Payment was cancelled")).not.toBeVisible();
    
    // Page should load normally
    await expect(page.getByText("Credits Management")).toBeVisible();
  });

  test("should persist notification across page refresh", async ({ page }) => {
    // Navigate with success parameter
    await page.goto("/dashboard/credits?success=true");
    
    // Check notification appears
    await expect(page.getByText("🎉 Payment successful!")).toBeVisible();
    
    // Verify URL has been cleaned
    await expect(page).toHaveURL("/dashboard/credits");
    
    // Refresh page
    await page.reload();
    
    // Notification should not reappear after refresh
    await expect(page.getByText("🎉 Payment successful!")).not.toBeVisible();
  });
});