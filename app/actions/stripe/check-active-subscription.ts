"use server";

import stripe from "@/lib/stripe";

/**
 * Check if customer has active paid Stripe subscription
 * Returns false for free tier subscriptions (unit_amount = 0)
 */
export async function checkActiveSubscription(customerId: string) {
  try {
    const subscriptions = await stripe.subscriptions.list({ customer: customerId });

    if (!subscriptions?.data?.length) return false;

    // Check if any subscription is active and has cost (not free tier)
    for (const sub of subscriptions.data) {
      if (sub.status !== "active") continue;

      for (const item of sub.items.data) {
        if (item.price.active === true && (item.price.unit_amount || 0) > 0) return true;
      }
    }

    return false;
  } catch (error) {
    console.error("Error checking Stripe subscription:", error);
    return false;
  }
}
