import config from "@/config";
const USER_ID = config.USER_ID;
const INSTALLATION_ID = config.INSTALLATION_ID;
const OWNER_ID = config.OWNER_ID;
const OWNER_NAME = config.OWNER_NAME;
const USER_NAME = config.USER_NAME;

import Stripe from "stripe";

const STRIPE_FREE_TIER_PRICE_ID = "price_1Oz6r2KUN3yUNaHzQQGk7SQ3";
const STRIPE_STANDARD_PLAN_PRICE_ID = "price_1P0s7DKUN3yUNaHzL0lUXBS4";

async function createStripeCustomer(stripe: Stripe) {
  const customer = await stripe.customers.create({
    name: OWNER_NAME,
    metadata: {
      owner_id: OWNER_ID,
      installation_id: INSTALLATION_ID,
      description: "GitAuto Github App Installation Event",
      user_id: USER_ID,
      user_name: USER_NAME,
    },
  });
  return customer.id;
}

async function subscribe_to_free_plan(stripe: Stripe, customer_id: string) {
  const subscription = await stripe.subscriptions.create({
    customer: customer_id,
    items: [{ price: STRIPE_FREE_TIER_PRICE_ID }],
  });
  return subscription;
}

export async function createCustomerWithFreePlan() {
  const stripe = await new Stripe(
    "sk_test_51OpME5KUN3yUNaHzn23LOJXtSJGapueOkEh0yZrBM7Yo8UQ0lFcRwbfjZUuLLSTjXPqu7pkP5KZgBYnaOYiaoy1y006HMOIwIg"
  );

  const customer_id = await createStripeCustomer(stripe);
  const subscription = await subscribe_to_free_plan(stripe, customer_id);
  return customer_id;
}
