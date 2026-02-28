"use server";

import { createGmailDraft } from "@/app/actions/gmail/create-draft";
import { EMAIL_FROM } from "@/config";
import { IS_DRY_RUN } from "@/config/drip-emails";
import { insertEmailSend } from "@/app/actions/supabase/email-sends/insert-email-send";
import { sendEmail } from "@/app/actions/resend/send-email";
import type { EmailType } from "@/types/drip-emails";

export interface SendResult {
  ownerId: number;
  emailType: EmailType;
  success: boolean;
}

export const sendAndRecord = async (
  ownerId: number,
  ownerName: string,
  emailType: EmailType,
  to: string,
  subject: string,
  text: string,
  scheduledAt: Date,
) => {
  console.log(`[drip] Sending ${emailType} to ${to} for owner ${ownerId} (${ownerName})`);

  let success: boolean;
  let resendEmailId: string | undefined;

  if (IS_DRY_RUN) {
    // Dry run: create a Gmail draft for manual review instead of sending via Resend
    const draftId = await createGmailDraft(to, subject, text);
    success = draftId !== null;
    if (!success)
      console.error(`[drip] Failed to create Gmail draft for ${emailType}, owner ${ownerId}`);
  } else {
    // Production: send via Resend
    const result = await sendEmail({
      from: EMAIL_FROM,
      to: [to],
      subject,
      text,
      scheduledAt,
    });
    success = result.success;
    resendEmailId = result.emailId;
    if (!success) console.error(`[drip] Failed to send ${emailType} for owner ${ownerId}:`, result);
  }

  if (success) {
    console.log(
      `[drip] ${IS_DRY_RUN ? "Drafted" : "Sent"} ${emailType} for owner ${ownerId}, recording to DB`,
    );
    await insertEmailSend({ ownerId, ownerName, emailType, resendEmailId });
  }

  return { ownerId, emailType, success };
};
