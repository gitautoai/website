import dotenv from "dotenv";
import { writeFileSync } from "fs";

dotenv.config({ path: ".env.local" });

async function main() {
  const issueId = process.argv[2];

  if (!issueId) {
    console.error("Usage: npx tsx scripts/sentry/get-issue.ts <ISSUE_ID>");
    console.error("Example: npx tsx scripts/sentry/get-issue.ts WEBSITE-3J");
    process.exit(1);
  }

  const sentryToken = process.env.SENTRY_PERSONAL_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG_SLUG;

  if (!sentryToken || !sentryOrg) {
    console.error("Error: SENTRY_PERSONAL_TOKEN and SENTRY_ORG_SLUG must be set in .env.local");
    process.exit(1);
  }

  const url = `https://sentry.io/api/0/organizations/${sentryOrg}/issues/${issueId}/events/latest/`;

  console.log(`Fetching Sentry issue ${issueId}...`);

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${sentryToken}` },
  });

  if (!response.ok) {
    console.error(`Error: HTTP ${response.status}`);
    console.error(await response.text());
    process.exit(1);
  }

  const data = await response.json();

  const outputPath = `/tmp/sentry_${issueId.toLowerCase()}.json`;
  writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`\nIssue ID: ${issueId}`);
  console.log(`Event ID: ${data.eventID}`);
  console.log(`Timestamp: ${data.dateCreated}`);
  console.log(`Full JSON saved to: ${outputPath}`);
  console.log();

  for (const entry of data.entries || []) {
    if (entry.type === "message") {
      const formattedMessage = entry.data?.formatted || "";
      console.log("=".repeat(80));
      console.log("ERROR MESSAGE:");
      console.log("=".repeat(80));
      console.log(formattedMessage.slice(0, 2000));
      if (formattedMessage.length > 2000)
        console.log(`\n... (truncated, total length: ${formattedMessage.length} chars)`);
      console.log();
    } else if (entry.type === "exception") {
      console.log("=".repeat(80));
      console.log("EXCEPTION:");
      console.log("=".repeat(80));
      for (const value of entry.data?.values || []) {
        console.log(`Type: ${value.type}`);
        console.log(`Value: ${value.value}`);
        console.log(`Module: ${value.module}`);
        console.log();

        const frames = value.stacktrace?.frames || [];
        if (frames.length) {
          console.log(`Stack trace (${frames.length} frames):`);
          console.log();

          for (const frame of frames.slice(-10)) {
            console.log(`  File: ${frame.filename}:${frame.lineno}`);
            console.log(`  Function: ${frame.function}`);
            if (frame.context_line) console.log(`  Line: ${frame.context_line.trim()}`);
            console.log();
          }
        }
      }
    }
  }

  const contexts = data.contexts || {};
  if (contexts.trace?.trace_id) {
    console.log(`Trace ID: ${contexts.trace.trace_id}`);
    console.log();
  }
}

main();
