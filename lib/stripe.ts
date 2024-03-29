import Stripe from "stripe";
// Get Stripe Secret Key from environment variables
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");

/**
 * Initialize Stripe. Server-side only.
 * @see https://github.com/stripe/stripe-node#usage-with-typescript
 */
const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16", // am not able to specify from env var
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
