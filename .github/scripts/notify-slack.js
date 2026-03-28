async function notifySlack(text) {
  if (!process.env.SLACK_BOT_TOKEN) {
    console.log("SLACK_BOT_TOKEN not set, skipping Slack notification");
    return;
  }
  const response = await fetch("https://slack.com/api/chat.postMessage", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      channel: "C08PHH352S3",
      text: `<!channel> ${text}`,
    }),
  });
  if (!response.ok) {
    console.error("Slack notification failed:", response.statusText);
  }
}

module.exports = notifySlack;
