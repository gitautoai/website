"use server";

import { EMAIL_FROM } from "@/config";
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
  const result = await sendEmail({
    from: EMAIL_FROM,
    to: [to],
    subject,
    text,
    scheduledAt,
  });

  if (result.success) {
    console.log(`[drip] Sent ${emailType} for owner ${ownerId}, recording to DB`);
    await insertEmailSend({ ownerId, ownerName, emailType, resendEmailId: result.emailId });
  } else {
    console.error(`[drip] Failed to send ${emailType} for owner ${ownerId}:`, result);
  }

  return { ownerId, emailType, success: result.success };
};
