"use server";

import { getOwner } from "@/app/actions/supabase/owners/get-owner";

export async function getCreditBalance(ownerId: number) {
  const owner = await getOwner(ownerId);
  if (!owner) return 0; // No owner record found

  return owner.credit_balance_usd || 0;
}
