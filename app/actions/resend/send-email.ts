"use server";

import { randomUUID } from "crypto";
import type { CreateEmailOptions, CreateEmailRequestOptions } from "resend";
import { resend } from "./index";

interface SendEmailParams {
  from: string;
  to: string[];
  cc?: string[];
  subject: string;
  text: string;
  scheduledAt?: Date;
}

export async function sendEmail({ from, to, cc, subject, text, scheduledAt }: SendEmailParams) {
  try {
    const params: CreateEmailOptions = {
      from,
      to,
      cc,
      subject,
      text,
    };

    if (scheduledAt) params.scheduledAt = scheduledAt.toISOString();

    const options: CreateEmailRequestOptions = {
      idempotencyKey: randomUUID(),
    };

    const { data, error } = await resend.emails.send(params, options);

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
