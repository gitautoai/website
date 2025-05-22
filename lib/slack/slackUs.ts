"use server";

export async function slackUs(message: string) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("SLACK_WEBHOOK_URL is not set. Skipping Slack notification.");
    return { success: false, error: "Webhook URL not configured" };
  }

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok)
      throw new Error(
        `Failed to send Slack notification: ${response.status} ${response.statusText}`
      );

    return { success: true };
  } catch (error) {
    console.error("Error sending Slack notification:", error);
    return { success: false, error: String(error) };
  }
}
