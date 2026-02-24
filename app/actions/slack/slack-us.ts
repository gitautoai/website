"use server";

import { isPrd } from "@/config";

const SLACK_CHANNEL_ID = "C08PHH352S3";

export async function slackUs(message: string, threadTs?: string) {
  if (!isPrd) return { success: true, skipped: true };

  const token = process.env.SLACK_BOT_TOKEN;
  if (!token) {
    console.warn("SLACK_BOT_TOKEN is not set. Skipping Slack notification.");
    return { success: false, error: "SLACK_BOT_TOKEN not set" };
  }

  console.log(`Slack: ${message}`);

  try {
    const body: Record<string, string> = { channel: SLACK_CHANNEL_ID, text: message };
    if (threadTs) body.thread_ts = threadTs;

    const response = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    if (!data.ok) throw new Error(`Slack API error: ${data.error}`);

    return { success: true, threadTs: data.ts };
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return { success: false, error: String(error) };
  }
}
