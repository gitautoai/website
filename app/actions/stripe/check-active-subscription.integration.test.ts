import { checkActiveSubscription } from "./check-active-subscription";
import stripe from "@/lib/stripe";

// Increase timeout for Stripe API calls
jest.setTimeout(60000);

describe("checkActiveSubscription integration", () => {
  let testCustomers: string[] = [];
  let testPrices: string[] = [];

  // Helper function to attach payment method to customer for paid subscriptions
  const attachPaymentMethod = async (customerId: string) => {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });
    await stripe.paymentMethods.attach(paymentMethod.id, { customer: customerId });
    await stripe.customers.update(customerId, {
      invoice_settings: { default_payment_method: paymentMethod.id },
    });
  };

  beforeAll(async () => {
    // Create test prices for different scenarios
    const freePriceResult = await stripe.prices.create({
      unit_amount: 0, // Free price
      currency: "usd",
      recurring: { interval: "month" },
      product_data: { name: "Free Plan Test" },
    });
    testPrices.push(freePriceResult.id);

    const paidPriceResult = await stripe.prices.create({
      unit_amount: 1999, // $19.99
      currency: "usd",
      recurring: { interval: "month" },
      product_data: { name: "Paid Plan Test" },
    });
    testPrices.push(paidPriceResult.id);
  });

  afterAll(async () => {
    // Clean up test prices
    for (const priceId of testPrices) {
      try {
        await stripe.prices.update(priceId, { active: false });
      } catch (error) {
        // Ignore cleanup errors
      }
    }
  });

  afterEach(async () => {
    // Clean up test customers and their subscriptions
    for (const customerId of testCustomers) {
      try {
        // Cancel all subscriptions
        const subscriptions = await stripe.subscriptions.list({ customer: customerId });
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
        // Delete customer
        await stripe.customers.del(customerId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    testCustomers = [];
  });

  it("should return false for customer with 0 subscriptions", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-no-subs-${randomId}@example.com`,
      name: `Test Customer No Subs ${randomId}`,
    });
    testCustomers.push(customer.id);

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(false);
  });

  it("should return true for customer with 1 paid active subscription", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-paid-active-${randomId}@example.com`,
      name: `Test Customer Paid Active ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(true);
  });

  it("should return false for customer with 1 paid non-active subscription", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-paid-inactive-${randomId}@example.com`,
      name: `Test Customer Paid Inactive ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });

    // Cancel the subscription to make it inactive
    await stripe.subscriptions.cancel(subscription.id);

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(false);
  });

  it("should return false for customer with 1 free subscription", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-free-${randomId}@example.com`,
      name: `Test Customer Free ${randomId}`,
    });
    testCustomers.push(customer.id);

    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[0] }], // Free price
    });

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(false);
  });

  it("should return true for customer with 1 free subscription and 1 paid active subscription both", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-free-paid-active-${randomId}@example.com`,
      name: `Test Customer Free Paid Active ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    // Create free subscription
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[0] }], // Free price
    });

    // Create paid subscription
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(true);
  });

  it("should return false for customer with 1 free subscription and 1 paid non-active subscription both", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-free-paid-inactive-${randomId}@example.com`,
      name: `Test Customer Free Paid Inactive ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    // Create free subscription
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[0] }], // Free price
    });

    // Create paid subscription and cancel it
    const paidSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });
    await stripe.subscriptions.cancel(paidSubscription.id);

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(false);
  });

  it("should return true for customer with 1 paid non-active subscription and 1 paid active subscription", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-paid-mixed-${randomId}@example.com`,
      name: `Test Customer Paid Mixed ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    // Create first paid subscription and cancel it
    const inactiveSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });
    await stripe.subscriptions.cancel(inactiveSubscription.id);

    // Create second paid subscription (active)
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(true);
  });

  it("should return true for customer with 1 free subscription and 1 paid non-active subscription and 1 paid active subscription", async () => {
    const randomId = Math.random().toString(36).substring(7);
    const customer = await stripe.customers.create({
      email: `test-complex-${randomId}@example.com`,
      name: `Test Customer Complex ${randomId}`,
    });
    testCustomers.push(customer.id);

    await attachPaymentMethod(customer.id);

    // Create free subscription
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[0] }], // Free price
    });

    // Create paid subscription and cancel it
    const inactiveSubscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });
    await stripe.subscriptions.cancel(inactiveSubscription.id);

    // Create another paid subscription (active)
    await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: testPrices[1] }], // Paid price
    });

    const result = await checkActiveSubscription(customer.id);
    expect(result).toBe(true);
  });

  it("should return false when customer does not exist", async () => {
    const result = await checkActiveSubscription("cus_nonexistent");
    expect(result).toBe(false);
  });
});