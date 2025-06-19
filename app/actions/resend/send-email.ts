"use server";

import { resend } from "./index";

interface SendEmailParams {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  text: string;
}

export async function sendEmail({ from, to, cc, subject, text }: SendEmailParams) {
  try {
    const { data, error } = await resend.emails.send({ from, to, cc, subject, text });

    if (error) {
      console.error("Failed to send email:", error);
      return { success: false, error: error.message };
    }

    return { success: true, emailId: data?.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
