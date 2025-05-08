import { config } from "@/config";
import stripe from ".";

// @see https://docs.stripe.com/api/subscriptions/list?lang=node
export const hasActiveSubscription = async (customerId: string) => {
  const subscriptions = await stripe.subscriptions.list({ customer: customerId });

  // Check if the response has data array
  if (!subscriptions) return false;
  if (!("data" in subscriptions)) return false;
  if (!Array.isArray(subscriptions["data"])) return false;
  if (subscriptions["data"].length === 0) return false;

  // Check if the subscription is active
  for (const sub of subscriptions["data"]) {
    if (sub.status !== "active") continue;

    // Check if the subscription has an active item
    for (const item of sub.items.data) {
      if (item.price.active === true && item.price.id !== config.STRIPE_FREE_TIER_PRICE_ID)
        return true;
    }
  }

  return false;
};
