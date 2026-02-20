import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const resolveSentryIssue = async (issueId: string, headers: HeadersInit, sentryOrg: string) => {
  const url = `https://sentry.io/api/0/organizations/${sentryOrg}/issues/${issueId}/`;

  process.stdout.write(`Resolving ${issueId}... `);
  const response = await fetch(url, {
    method: "PUT",
    headers,
    body: JSON.stringify({ status: "resolved" }),
  });

  if (response.ok) {
    console.log("done");
    return true;
  }
  console.log(`failed (HTTP ${response.status})`);
  return false;
};

const main = async () => {
  const issueIds = process.argv.slice(2);

  if (issueIds.length === 0) {
    console.error("Usage: npx tsx scripts/sentry/resolve-issue.ts <ISSUE_ID> [ISSUE_ID...]");
    console.error("Example: npx tsx scripts/sentry/resolve-issue.ts WEBSITE-2K WEBSITE-2J");
    process.exit(1);
  }

  const sentryToken = process.env.SENTRY_PERSONAL_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG_SLUG;

  if (!sentryToken || !sentryOrg) {
    console.error("Error: SENTRY_PERSONAL_TOKEN and SENTRY_ORG_SLUG must be set in .env.local");
    process.exit(1);
  }

  const headers = {
    Authorization: `Bearer ${sentryToken}`,
    "Content-Type": "application/json",
  };

  const failed: string[] = [];
  for (const issueId of issueIds) {
    const ok = await resolveSentryIssue(issueId, headers, sentryOrg);
    if (!ok) failed.push(issueId);
  }

  if (failed.length > 0) {
    console.error(`\nFailed to resolve: ${failed.join(", ")}`);
    process.exit(1);
  }
};

main();
