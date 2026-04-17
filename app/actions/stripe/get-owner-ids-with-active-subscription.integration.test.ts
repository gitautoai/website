import { getOwnerIdsWithActiveSubscription } from "./get-owner-ids-with-active-subscription";
import { supabaseAdmin } from "@/lib/supabase/server";
import stripe from "@/lib/stripe";

jest.setTimeout(60000);

describe("getOwnerIdsWithActiveSubscription (integration)", () => {
  let testCustomers: string[] = [];
  let testOwners: number[] = [];
  const testPrices: string[] = [];

  beforeAll(async () => {
    // Create a paid price for testing
    const paidPriceResult = await stripe.prices.create({
      unit_amount: 1999, // $19.99
      currency: "usd",
      recurring: { interval: "month" },
      product_data: { name: "Integration Test Paid Plan" },
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
        const subscriptions = await stripe.subscriptions.list({ customer: customerId });
        for (const sub of subscriptions.data) {
          await stripe.subscriptions.cancel(sub.id);
        }
        await stripe.customers.del(customerId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    // Clean up test owners in Supabase
    for (const ownerId of testOwners) {
      try {
        await supabaseAdmin.from("owners").delete().eq("owner_id", ownerId);
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    testCustomers = [];
    testOwners = [];
  });

  const createTestOwnerWithStripeCustomer = async (hasSubscription: boolean) => {
    const randomId = Math.floor(Math.random() * 1000000) + 200000;
    const customer = await stripe.customers.create({
      email: `int-test-${randomId}@example.com`,
      name: `Test Customer ${randomId}`,
    });
    testCustomers.push(customer.id);

    if (hasSubscription) {
      await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: testPrices[0] }],
      });
    }

    const { data: owner, error } = await supabaseAdmin
      .from("owners")
      .insert({
        owner_id: randomId,
        owner_name: `test-user-${randomId}`,
        owner_type: "User",
        stripe_customer_id: customer.id,
        credit_balance_usd: 0,
        auto_reload_enabled: false,
        auto_reload_threshold_usd: 10,
        auto_reload_target_usd: 50,
        org_rules: "",
      })
      .select()
      .single();

    if (error || !owner) throw new Error(`Failed to create test owner: ${error}`);
    testOwners.push(owner.owner_id);
    return owner.owner_id;
  };

  it("returns owner IDs for owners with active subscriptions", async () => {
    const ownerId = await createTestOwnerWithStripeCustomer(true);
    const result = await getOwnerIdsWithActiveSubscription([ownerId]);

    expect(result.has(ownerId)).toBe(true);
  });

  it("excludes owners without active subscriptions", async () => {
    const ownerId = await createTestOwnerWithStripeCustomer(false);
    const result = await getOwnerIdsWithActiveSubscription([ownerId]);

    expect(result.has(ownerId)).toBe(false);
  });

  it("correctly filters a mix of owners", async () => {
    const activeOwnerId = await createTestOwnerWithStripeCustomer(true);
    const inactiveOwnerId = await createTestOwnerWithStripeCustomer(false);

    const result = await getOwnerIdsWithActiveSubscription([activeOwnerId, inactiveOwnerId]);

    expect(result.has(activeOwnerId)).toBe(true);
    expect(result.has(inactiveOwnerId)).toBe(false);
    expect(result.size).toBe(1);
  });

  it("returns empty set when no owners are provided", async () => {
    const result = await getOwnerIdsWithActiveSubscription([]);
    expect(result.size).toBe(0);
  });
});
