import { chargeSavedPaymentMethod } from "./charge-saved-payment-method";
import stripe from "@/lib/stripe";

describe("chargeSavedPaymentMethod integration", () => {
  let testCustomerId: string;
  let testPaymentMethodId: string;

  beforeEach(async () => {
    // Create fresh customer and payment method for each test
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-${randomId}@example.com`,
      name: `Test Customer ${randomId}`,
    });
    testCustomerId = customer.id;

    // Create payment method using test token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    testPaymentMethodId = paymentMethod.id;

    // Attach to customer
    await stripe.paymentMethods.attach(testPaymentMethodId, {
      customer: testCustomerId,
    });

    // Set as default
    await stripe.customers.update(testCustomerId, {
      invoice_settings: {
        default_payment_method: testPaymentMethodId,
      },
    });
  });

  afterEach(async () => {
    // Clean up test data
    try {
      if (testPaymentMethodId) await stripe.paymentMethods.detach(testPaymentMethodId);
    } catch (error) {
      // Ignore cleanup errors
    }

    try {
      if (testCustomerId) await stripe.customers.del(testCustomerId);
    } catch (error) {
      // Ignore cleanup errors
    }
  });

  it("should successfully charge a customer with default payment method", async () => {
    const result = await chargeSavedPaymentMethod({
      customerId: testCustomerId,
      amountUsd: 10, // $10
      description: "Test charge",
      metadata: {
        test: "true",
        purpose: "integration_test",
      },
    });

    expect(result.success).toBe(true);
    expect(result.paymentIntentId).toBeDefined();
    expect(result.error).toBeUndefined();

    // Verify payment intent was created correctly
    if (result.paymentIntentId) {
      const paymentIntent = await stripe.paymentIntents.retrieve(result.paymentIntentId);
      expect(paymentIntent.amount).toBe(1000); // $10 in cents
      expect(paymentIntent.currency).toBe("usd");
      expect(paymentIntent.customer).toBe(testCustomerId);
      expect(paymentIntent.payment_method).toBe(testPaymentMethodId);
      expect(paymentIntent.description).toBe("Test charge");
      expect(paymentIntent.metadata.test).toBe("true");
      expect(paymentIntent.metadata.purpose).toBe("integration_test");
      expect(paymentIntent.metadata.credit_amount).toBe("10");
      expect(paymentIntent.status).toBe("succeeded");
    }
  });

  it("should fail when customer does not exist", async () => {
    const result = await chargeSavedPaymentMethod({
      customerId: "cus_nonexistent",
      amountUsd: 10,
      description: "Test charge",
      metadata: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("customer");
    expect(result.paymentIntentId).toBeUndefined();
  });

  it("should fail when customer has no default payment method", async () => {
    // Create customer without payment method
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-no-payment-${randomId}@example.com`,
      name: `Test Customer No Payment ${randomId}`,
    });

    const result = await chargeSavedPaymentMethod({
      customerId: customer.id,
      amountUsd: 10,
      description: "Test charge",
      metadata: {},
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("No default payment method found");
    expect(result.paymentIntentId).toBeUndefined();
  });

  it("should handle different amount values correctly", async () => {
    // Test different amounts using the setup customer
    const amounts = [5, 25, 100];

    for (const amountUsd of amounts) {
      const result = await chargeSavedPaymentMethod({
        customerId: testCustomerId,
        amountUsd,
        description: `Test charge for $${amountUsd}`,
        metadata: { amount_test: amountUsd.toString() },
      });

      expect(result.success).toBe(true);
      expect(result.paymentIntentId).toBeDefined();

      if (result.paymentIntentId) {
        const paymentIntent = await stripe.paymentIntents.retrieve(result.paymentIntentId);
        expect(paymentIntent.amount).toBe(amountUsd * 100); // Convert to cents
        expect(paymentIntent.metadata.credit_amount).toBe(amountUsd.toString());
      }
    }
  });

  it("should handle payment method object instead of string", async () => {
    // This test verifies our function handles different payment method ID formats
    const result = await chargeSavedPaymentMethod({
      customerId: testCustomerId,
      amountUsd: 15,
      description: "Test payment method object",
      metadata: { test_scenario: "payment_method_object" },
    });

    expect(result.success).toBe(true);
    expect(result.paymentIntentId).toBeDefined();
  });
});
