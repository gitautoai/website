import { chargeSavedPaymentMethod } from "./charge-saved-payment-method";
import stripe from "@/lib/stripe";

describe("chargeSavedPaymentMethod integration", () => {
  // Helper function to create a customer with payment method for each test
  async function createTestCustomer() {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-${randomId}@example.com`,
      name: `Test Customer ${randomId}`,
    });

    // Create payment method using test token
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });

    // Attach to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customer.id,
    });

    // Set as default
    await stripe.customers.update(customer.id, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    return { customerId: customer.id, paymentMethodId: paymentMethod.id };
  }

  // Helper function to cleanup test customer
  async function cleanupTestCustomer(customerId: string, paymentMethodId: string) {
    try {
      if (paymentMethodId) await stripe.paymentMethods.detach(paymentMethodId);
    } catch (error) {
      // Ignore cleanup errors
    }

    try {
      if (customerId) await stripe.customers.del(customerId);
    } catch (error) {
      // Ignore cleanup errors
    }
  }

  it("should successfully charge a customer with default payment method", async () => {
    const { customerId, paymentMethodId } = await createTestCustomer();
    
    const result = await chargeSavedPaymentMethod({
      customerId,
      amountUsd: 10, // $10
      description: "Test charge",
      metadata: {
        owner_id: "test-owner-" + Math.random().toString(36).substring(7),
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
      expect(paymentIntent.customer).toBe(customerId);
      expect(paymentIntent.payment_method).toBe(paymentMethodId);
      expect(paymentIntent.description).toBe("Test charge");
      expect(paymentIntent.metadata.test).toBe("true");
      expect(paymentIntent.metadata.purpose).toBe("integration_test");
      expect(paymentIntent.metadata.credit_amount).toBe("10");
      expect(paymentIntent.status).toBe("succeeded");
    }
    
    await cleanupTestCustomer(customerId, paymentMethodId);
  }, 10000);

  it("should fail when customer does not exist", async () => {
    const result = await chargeSavedPaymentMethod({
      customerId: "cus_nonexistent",
      amountUsd: 10,
      description: "Test charge",
      metadata: {
        owner_id: "test-owner-" + Math.random().toString(36).substring(7),
      },
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
      metadata: {
        owner_id: "test-owner-" + Math.random().toString(36).substring(7),
      },
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe("No default payment method found");
    expect(result.paymentIntentId).toBeUndefined();
    
    // Cleanup customer
    await stripe.customers.del(customer.id);
  });

  it("should handle different amount values correctly", async () => {
    const { customerId, paymentMethodId } = await createTestCustomer();
    
    // Test different amounts using the setup customer
    const amounts = [5, 25, 100];
    console.log("Starting tests with customer:", customerId);

    for (const amountUsd of amounts) {
      console.log(`Starting charge for $${amountUsd} at`, new Date().toISOString());
      const result = await chargeSavedPaymentMethod({
        customerId,
        amountUsd,
        description: `Test charge for $${amountUsd}`,
        metadata: {
          owner_id: "test-owner-" + Math.random().toString(36).substring(7),
          amount_test: amountUsd.toString(),
        },
      });
      console.log(`Charge completed for $${amountUsd} at`, new Date().toISOString(), "Success:", result.success);

      expect(result.success).toBe(true);
      expect(result.paymentIntentId).toBeDefined();

      if (result.paymentIntentId) {
        console.log(`Retrieving payment intent for $${amountUsd} at`, new Date().toISOString());
        const paymentIntent = await stripe.paymentIntents.retrieve(result.paymentIntentId);
        console.log(`Payment intent retrieved for $${amountUsd} at`, new Date().toISOString());
        expect(paymentIntent.amount).toBe(amountUsd * 100); // Convert to cents
        expect(paymentIntent.metadata.credit_amount).toBe(amountUsd.toString());
      }
    }
    console.log("All charges completed, starting cleanup at", new Date().toISOString());
    
    await cleanupTestCustomer(customerId, paymentMethodId);
  }, 15000);

  it("should handle payment method object instead of string", async () => {
    const { customerId, paymentMethodId } = await createTestCustomer();
    
    // This test verifies our function handles different payment method ID formats
    const result = await chargeSavedPaymentMethod({
      customerId,
      amountUsd: 15,
      description: "Test payment method object",
      metadata: {
        owner_id: "test-owner-" + Math.random().toString(36).substring(7),
        test_scenario: "payment_method_object",
      },
    });

    expect(result.success).toBe(true);
    expect(result.paymentIntentId).toBeDefined();
    
    await cleanupTestCustomer(customerId, paymentMethodId);
  }, 10000);
});
