"use server";

import stripe from "@/lib/stripe";

/**
 * Fetch Stripe customer IDs that had a paid subscription but canceled it.
 * Returns a Map of customer ID → cancellation date (ISO string).
 */
export const getCanceledSubscriptionCustomerIds = async () => {
  const customers = new Map<string, string>();

  for await (const sub of stripe.subscriptions.list({ status: "canceled", limit: 100 })) {
    const customerId = sub.customer as string;
    if (customers.has(customerId)) continue;

    for (const item of sub.items.data) {
      if (item.price.active && (item.price.unit_amount || 0) > 0) {
        const canceledAt = sub.canceled_at
          ? new Date(sub.canceled_at * 1000).toISOString()
          : new Date().toISOString();
        customers.set(customerId, canceledAt);
        break;
      }
    }
  }

  return customers;
};
