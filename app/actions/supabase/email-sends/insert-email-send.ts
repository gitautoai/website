"use server";

import { supabaseAdmin } from "@/lib/supabase/server";
import type { EmailType } from "@/types/drip-emails";

interface InsertEmailSendParams {
  ownerId: number;
  ownerName: string;
  emailType: EmailType;
  resendEmailId?: string;
}

/**
 * Insert an email send record. The UNIQUE constraint on (owner_id, email_type)
 * prevents duplicate sends. Returns true if inserted, false if already exists.
 */
export const insertEmailSend = async ({
  ownerId,
  ownerName,
  emailType,
  resendEmailId,
}: InsertEmailSendParams) => {
  const { error } = await supabaseAdmin.from("email_sends").insert({
    owner_id: ownerId,
    owner_name: ownerName,
    email_type: emailType,
    resend_email_id: resendEmailId ?? null,
  });

  if (error) {
    // 23505 = unique_violation, meaning this email was already sent
    if (error.code === "23505") return false;
    throw new Error(`Failed to insert email send: ${error.message}`);
  }

  return true;
};
