"use server";

import { getCanceledSubscriptionCustomerIds } from "./get-canceled-subscription-customer-ids";
import { getOwners } from "@/app/actions/supabase/owners/get-owners";

/**
 * Returns a Map of owner ID → cancellation date (ISO string)
 * for owners that had a paid subscription that is now canceled.
 */
export const getOwnerIdsHadSubscription = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) return new Map<number, string>();

  const [owners, canceledCustomers] = await Promise.all([
    getOwners(ownerIds),
    getCanceledSubscriptionCustomerIds(),
  ]);

  const result = new Map<number, string>();
  for (const o of owners) {
    if (!o.stripe_customer_id) continue;
    const canceledAt = canceledCustomers.get(o.stripe_customer_id);
    if (canceledAt) result.set(o.owner_id, canceledAt);
  }
  return result;
};
