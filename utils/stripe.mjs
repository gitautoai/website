import Stripe from "stripe";
// Get Stripe Secret Key from environment variables
const STRIPE_SECRET_KEY =
  "sk_test_51OpME5KUN3yUNaHzn23LOJXtSJGapueOkEh0yZrBM7Yo8UQ0lFcRwbfjZUuLLSTjXPqu7pkP5KZgBYnaOYiaoy1y006HMOIwIg";
if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");

/**
 * Initialize Stripe. Server-side only.
 * @see https://github.com/stripe/stripe-node#usage-with-typescript
 */
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
  typescript: true,
  maxNetworkRetries: undefined, // Default is 0
  httpAgent: undefined,
  httpClient: undefined,
  timeout: undefined, // Default is 80000
  host: undefined,
  port: undefined,
  protocol: undefined,
  telemetry: undefined,
  appInfo: undefined,
  stripeAccount: undefined,
});

export default stripe;

session = await stripe.billingPortal.sessions.create({
  customer: "3",
});

console.log("SEs: ", session);
