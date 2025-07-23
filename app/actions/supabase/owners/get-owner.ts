"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import { Database } from "@/types/supabase";

type Owner = Database["public"]["Tables"]["owners"]["Row"];

export async function getOwner(ownerId: number): Promise<Owner | null> {
  const { data, error } = await supabaseAdmin
    .from("owners")
    .select("*")
    .eq("owner_id", ownerId)
    .maybeSingle();

  if (error) throw new Error(`Failed to get owner: ${error.message}`);

  return data;
}
