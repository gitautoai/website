"use server";

import { getActiveSubscriptionCustomerIds } from "./get-active-subscription-customer-ids";
import { getOwners } from "@/app/actions/supabase/owners/get-owners";

/** Returns owner IDs that currently have an active paid subscription. */
export const getOwnerIdsWithActiveSubscription = async (ownerIds: number[]) => {
  if (ownerIds.length === 0) return new Set<number>();

  const [owners, activeCustomerIds] = await Promise.all([
    getOwners(ownerIds),
    getActiveSubscriptionCustomerIds(),
  ]);

  const result = new Set<number>();
  for (const o of owners) {
    if (o.stripe_customer_id && activeCustomerIds.has(o.stripe_customer_id)) result.add(o.owner_id);
  }
  return result;
};
