"use server";

import type { Database } from "@/types/supabase";
import { supabaseAdmin } from "@/lib/supabase/server";

type CreditInsert = Database["public"]["Tables"]["credits"]["Insert"];

export async function insertCredits(data: CreditInsert) {
  const { error } = await supabaseAdmin.from("credits").insert(data);

  if (error) throw new Error(`Failed to insert credits: ${error.message}`);
}
