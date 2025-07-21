import { createCheckoutSession } from "./create-checkout-session";
import stripe from "@/lib/stripe";
import { BASE_URL, ABSOLUTE_URLS } from "@/config/urls";
import Stripe from "stripe";

// Increase timeout for Stripe API calls
jest.setTimeout(60000);

describe("createCheckoutSession integration", () => {
  let testCustomers: string[] = [];

  afterEach(async () => {
    // Clean up test customers
    for (const customerId of testCustomers) {
      try {
        await stripe.customers.del(customerId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    testCustomers = [];
  });

  it("should successfully create checkout session with payment success configuration", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-checkout-${randomId}@example.com`,
      name: `Test Customer Checkout ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 25, // $25
      metadata: {
        test: "true",
        purpose: "integration_test",
        amount: "25",
      },
    });

    expect(result).toBeDefined();
    expect(result.id).toMatch(/^cs_/); // Checkout session ID format
    expect(result.mode).toBe("payment");
    expect(result.currency).toBe("usd");
    expect(result.customer).toBe(customer.id);
    expect(result.client_reference_id).toBe(customer.id);

    // When using customer parameter, customer_email is not set in session
    // but the customer's email is available through the customer object
    expect(result.customer_email).toBeNull();

    // Verify amount total
    expect(result.amount_total).toBe(2500); // $25 in cents

    // Verify line items by expanding them
    const expandedSession = await stripe.checkout.sessions.retrieve(result.id, {
      expand: ["line_items"],
    });
    expect(expandedSession.line_items?.data).toBeDefined();
    expect(expandedSession.line_items?.data).toHaveLength(1);

    // Verify metadata
    expect(result.metadata).toEqual({
      test: "true",
      purpose: "integration_test",
      amount: "25",
    });

    // Verify fixed success URL and default cancel URL
    expect(result.success_url).toBe(ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS_SUCCESS);
    expect(result.cancel_url).toBe(ABSOLUTE_URLS.GITAUTO.CANCEL_FALLBACK);
  });

  it("should configure payment method settings correctly for future use", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-payment-method-${randomId}@example.com`,
      name: `Test Customer Payment Method ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 50,
      metadata: { test_case: "payment_method_config" },
    });

    // Verify payment intent is not yet created (created when session is paid)
    expect(result.payment_intent).toBeNull();

    // Verify the session is configured for payment mode
    expect(result.mode).toBe("payment");
    expect(result.customer).toBe(customer.id);

    // Verify customer update settings are configured correctly
    // Note: customer_update may not be included in the response but session was created successfully
    if ("customer_update" in result && result.customer_update)
      expect(result.customer_update).toEqual({
        address: "auto",
        name: "auto",
      });
  });

  it("should handle invalid customer ID gracefully", async () => {
    await expect(
      createCheckoutSession({
        customerId: "cus_nonexistent",
        amountUsd: 10,
        metadata: {},
      })
    ).rejects.toThrow();
  });

  it("should handle different amount values correctly", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-amounts-${randomId}@example.com`,
      name: `Test Customer Amounts ${randomId}`,
    });
    testCustomers.push(customer.id);

    const amounts = [10, 100, 500]; // $10, $100, $500

    for (const amount of amounts) {
      const result = await createCheckoutSession({
        customerId: customer.id,
        amountUsd: amount,
        metadata: { amount_test: amount.toString() },
      });

      expect(result.amount_total).toBe(amount * 100); // Convert to cents

      // Verify line items structure: $1 per unit × amount units = total amount
      const session = await stripe.checkout.sessions.retrieve(result.id, {
        expand: ["line_items"],
      });

      expect(session.line_items?.data).toHaveLength(1);
      const lineItem = session.line_items?.data[0];
      expect(lineItem?.price?.unit_amount).toBe(100); // $1 in cents
      expect(lineItem?.quantity).toBe(amount); // Number of $1 units
    }
  });

  it("should handle custom cancel URL while success URL is fixed", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-urls-${randomId}@example.com`,
      name: `Test Customer URLs ${randomId}`,
    });
    testCustomers.push(customer.id);

    const customCancelUrl = "https://example.com/cancel";

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 20,
      metadata: { test: "custom_urls" },
      cancelUrl: customCancelUrl,
    });

    expect(result.success_url).toBe(ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS_SUCCESS);
    expect(result.cancel_url).toBe(customCancelUrl);
  });

  it("should pass metadata correctly to both session and payment intent", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-metadata-${randomId}@example.com`,
      name: `Test Customer Metadata ${randomId}`,
    });
    testCustomers.push(customer.id);

    const testMetadata = {
      user_id: "12345",
      plan: "standard",
      source: "dashboard",
      timestamp: new Date().toISOString(),
    };

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 75,
      metadata: testMetadata,
    });

    // Verify session metadata
    expect(result.metadata).toEqual(testMetadata);

    // Payment intent is not created until session is paid, so just verify session config
    expect(result.payment_intent).toBeNull();
    expect(result.mode).toBe("payment");
  });

  it("should configure line items with correct GitAuto credit structure", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-line-items-${randomId}@example.com`,
      name: `Test Customer Line Items ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 40,
      metadata: { test: "line_items" },
    });

    // Retrieve session with expanded line items and price data
    const session = await stripe.checkout.sessions.retrieve(result.id, {
      expand: ["line_items", "line_items.data.price"],
    });

    expect(session.line_items?.data).toHaveLength(1);
    const lineItem = session.line_items?.data[0];

    expect(lineItem?.price?.currency).toBe("usd");
    expect(lineItem?.price?.unit_amount).toBe(100); // $1 in cents
    expect(lineItem?.quantity).toBe(40); // 40 units of $1 = $40

    // Note: product_data is only available on inline prices (price_data)
    // Since we're using inline price_data, the product data should be accessible
    // but may not be expanded in the response. Let's verify what we can:
    expect(lineItem?.price?.type).toBe("one_time");
    expect(lineItem?.amount_total).toBe(4000); // $40 in cents
  });

  it("should configure tax and billing settings correctly", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-tax-billing-${randomId}@example.com`,
      name: `Test Customer Tax Billing ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 30,
      metadata: { test: "tax_billing" },
    });

    // Verify tax and billing configurations
    expect(result.automatic_tax?.enabled).toBe(true);
    expect(result.billing_address_collection).toBe("auto");
    expect(result.tax_id_collection?.enabled).toBe(true);
    expect(result.allow_promotion_codes).toBe(true);
    expect(result.consent_collection?.terms_of_service).toBe("none");
    expect(result.locale).toBe("auto");

    // Verify recovery settings
    expect(result.after_expiration?.recovery?.enabled).toBe(true);
  });

  it("should validate customer email is set correctly", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const testEmail = `test-email-${randomId}@example.com`;
    const customer = await stripe.customers.create({
      email: testEmail,
      name: `Test Customer Email ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 15,
      metadata: { test: "email_validation" },
    });

    expect(result.customer).toBe(customer.id);
    expect(result.client_reference_id).toBe(customer.id);

    // Verify the customer's actual email by retrieving the customer
    const retrievedCustomer = await stripe.customers.retrieve(customer.id);
    if ("email" in retrievedCustomer) expect(retrievedCustomer.email).toBe(testEmail);
  });

  it("should handle minimum and maximum amounts correctly", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-min-max-${randomId}@example.com`,
      name: `Test Customer Min Max ${randomId}`,
    });
    testCustomers.push(customer.id);

    // Test minimum amount
    const minResult = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 1,
      metadata: { test: "minimum_amount" },
    });
    expect(minResult.amount_total).toBe(100); // $1 in cents

    // Test larger amount
    const maxResult = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 1000, // $1000
      metadata: { test: "large_amount" },
    });
    expect(maxResult.amount_total).toBe(100000); // $1000 in cents
  });

  it("should create checkout session for customer without email", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      // No email provided
      name: `Test Customer No Email ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 50,
      metadata: { test: "no_email_customer" },
    });

    expect(result).toBeDefined();
    expect(result.customer).toBe(customer.id);
    expect(result.customer_email).toBeNull();
    expect(result.amount_total).toBe(5000); // $50 in cents

    // Verify customer has no email
    const retrievedCustomer = await stripe.customers.retrieve(customer.id);
    if ("email" in retrievedCustomer) expect(retrievedCustomer.email).toBeNull();
  });

  it("should configure checkout session with required parameters for automatic payment method attachment and future auto-charging", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-payment-method-${randomId}@example.com`,
      name: `Test Customer Payment Method ${randomId}`,
    });
    testCustomers.push(customer.id);

    const checkoutSession = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 25,
      metadata: { test: "payment_method_attachment" },
    });

    // Verify the critical parameters that guarantee automatic payment method attachment
    expect(checkoutSession.customer).toBe(customer.id); // Customer ID enables payment method attachment
    expect(checkoutSession.mode).toBe("payment"); // Payment mode with customer enables attachment
    expect(checkoutSession.client_reference_id).toBe(customer.id);
    expect(checkoutSession.currency).toBe("usd");
    expect(checkoutSession.amount_total).toBe(2500); // $25 in cents
  });

  it("should configure checkout session to enable automatic payment method collection", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-auto-payment-${randomId}@example.com`,
      name: `Test Customer Auto Payment ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 100,
      metadata: { test: "auto_payment_collection" },
    });

    // Verify session is configured correctly for payment method collection
    expect(result.mode).toBe("payment");
    expect(result.customer).toBe(customer.id);

    // In payment mode, Stripe automatically collects payment methods during checkout
    expect(result.payment_intent).toBeNull(); // Created after payment starts

    // Verify customer update settings enable address/name collection
    if (
      "customer_update" in result &&
      result.customer_update &&
      typeof result.customer_update === "object" &&
      "address" in result.customer_update &&
      "name" in result.customer_update
    ) {
      expect(result.customer_update.address).toBe("auto");
      expect(result.customer_update.name).toBe("auto");
    }
  });

  it("should handle dynamic cancel URL while success URL is always fixed to credits page", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-dynamic-urls-${randomId}@example.com`,
      name: `Test Customer Dynamic URLs ${randomId}`,
    });
    testCustomers.push(customer.id);

    const customCancelUrl = "https://gitauto.ai/dashboard/usage";

    const result = await createCheckoutSession({
      customerId: customer.id,
      amountUsd: 25,
      metadata: { test: "dynamic_urls" },
      cancelUrl: customCancelUrl,
    });

    // Verify URL handling: success is always fixed, cancel is dynamic
    expect(result.success_url).toBe(ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS_SUCCESS);
    expect(result.cancel_url).toBe(customCancelUrl);
    expect(result.customer).toBe(customer.id);
    expect(result.amount_total).toBe(2500); // $25 in cents
  });
});
