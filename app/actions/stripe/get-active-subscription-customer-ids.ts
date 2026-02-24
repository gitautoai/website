"use server";

import stripe from "@/lib/stripe";

/**
 * Fetch all Stripe customer IDs that have an active paid subscription.
 * Single paginated API call - much faster than per-owner lookups.
 */
export const getActiveSubscriptionCustomerIds = async () => {
  const customerIds = new Set<string>();

  for await (const sub of stripe.subscriptions.list({ status: "active", limit: 100 })) {
    for (const item of sub.items.data) {
      if (item.price.active && (item.price.unit_amount || 0) > 0) {
        customerIds.add(sub.customer as string);
        break;
      }
    }
  }

  return customerIds;
};
