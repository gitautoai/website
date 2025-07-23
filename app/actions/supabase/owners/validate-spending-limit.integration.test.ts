import { validateAutoReloadSpendingLimit } from "./validate-spending-limit";
import { supabaseAdmin } from "@/lib/supabase/server";
import { insertCredits } from "../credits/insert-credits";

describe("validateAutoReloadSpendingLimit integration", () => {
  const testOwnerId = Math.floor(Math.random() * 1000000) + 300000;

  beforeEach(async () => {
    // Clean up any existing data
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  afterEach(async () => {
    // Clean up test data
    await supabaseAdmin.from("credits").delete().eq("owner_id", testOwnerId);
    await supabaseAdmin.from("owners").delete().eq("owner_id", testOwnerId);
  });

  describe("spending limit scenarios", () => {
    it("should allow full amount when no spending limit is set (null)", async () => {
      // Create owner without spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User", 
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: null, // No limit set
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.adjustedAmountUsd).toBe(100);
      expect(result.reason).toBe("No spending limit set");
    });

    it("should allow full amount when within spending limit", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: 5000,
      });

      // Add $1000 worth of spending this month
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 1000,
        transaction_type: "purchase",
        stripe_payment_intent_id: "pi_test_1000",
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 100,
      });

      expect(result.allowed).toBe(true);
      expect(result.adjustedAmountUsd).toBe(100);
      expect(result.currentMonthlySpending).toBe(1000);
      expect(result.spendingLimit).toBe(5000);
      expect(result.remainingLimit).toBe(4000);
      expect(result.isAdjusted).toBe(false);
    });

    it("should adjust amount when requested exceeds remaining limit", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer", 
        max_spending_limit_usd: 5000,
      });

      // Add $4980 worth of spending this month
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 4980,
        transaction_type: "purchase",
        stripe_payment_intent_id: "pi_test_4980",
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 100, // Requesting $100 but only $20 remaining
      });

      expect(result.allowed).toBe(true);
      expect(result.adjustedAmountUsd).toBe(20); // Should be adjusted to $20
      expect(result.currentMonthlySpending).toBe(4980);
      expect(result.spendingLimit).toBe(5000);
      expect(result.remainingLimit).toBe(20);
      expect(result.isAdjusted).toBe(true);
      expect(result.reason).toBe("Amount adjusted to fit within spending limit");
    });

    it("should skip auto-reload when spending limit is already reached", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: 5000,
      });

      // Add exactly $5000 worth of spending this month
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 5000,
        transaction_type: "purchase",
        stripe_payment_intent_id: "pi_test_5000",
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 100,
      });

      expect(result.allowed).toBe(false);
      expect(result.adjustedAmountUsd).toBe(0);
      expect(result.currentMonthlySpending).toBe(5000);
      expect(result.spendingLimit).toBe(5000);
      expect(result.remainingLimit).toBe(0);
      expect(result.reason).toBe("Monthly spending limit already reached");
    });

    it("should skip auto-reload when spending already exceeds limit", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: 5000,
      });

      // Add $6000 worth of spending this month (already over limit)
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 6000,
        transaction_type: "purchase", 
        stripe_payment_intent_id: "pi_test_6000",
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 100,
      });

      expect(result.allowed).toBe(false);
      expect(result.adjustedAmountUsd).toBe(0);
      expect(result.currentMonthlySpending).toBe(6000);
      expect(result.spendingLimit).toBe(5000);
      expect(result.remainingLimit).toBe(0);
      expect(result.reason).toBe("Monthly spending limit already reached");
    });

    it("should include auto_reload transactions in monthly spending calculation", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: 5000,
      });

      // Add mix of purchase and auto_reload transactions
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 2000,
        transaction_type: "purchase",
        stripe_payment_intent_id: "pi_test_purchase",
      });

      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 2000,
        transaction_type: "auto_reload",
        stripe_payment_intent_id: "pi_test_auto_reload",
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 1500, // $4000 spent + $1500 = $5500, should be adjusted to $1000
      });

      expect(result.allowed).toBe(true);
      expect(result.adjustedAmountUsd).toBe(1000); // Only $1000 remaining out of $5000 limit
      expect(result.currentMonthlySpending).toBe(4000); // $2000 + $2000
      expect(result.isAdjusted).toBe(true);
    });

    it("should not include usage (negative) transactions in spending calculation", async () => {
      // Create owner with $5000 spending limit
      await supabaseAdmin.from("owners").insert({
        owner_id: testOwnerId,
        owner_name: "test-owner",
        owner_type: "User",
        stripe_customer_id: "test_customer",
        max_spending_limit_usd: 5000,
      });

      // Add purchase and usage transactions
      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: 3000,
        transaction_type: "purchase",
        stripe_payment_intent_id: "pi_test_purchase",
      });

      await insertCredits({
        owner_id: testOwnerId,
        amount_usd: -500, // Usage transaction (negative)
        transaction_type: "usage",
        stripe_payment_intent_id: null,
      });

      const result = await validateAutoReloadSpendingLimit({
        ownerId: testOwnerId,
        requestedAmountUsd: 1000,
      });

      expect(result.allowed).toBe(true);
      expect(result.adjustedAmountUsd).toBe(1000);
      expect(result.currentMonthlySpending).toBe(3000); // Only positive amounts counted
      expect(result.remainingLimit).toBe(2000);
    });
  });
});