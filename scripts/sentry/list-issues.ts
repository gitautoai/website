import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const main = async () => {
  const query = process.argv[2] || "is:unresolved";

  const sentryToken = process.env.SENTRY_PERSONAL_TOKEN;
  const sentryOrg = process.env.SENTRY_ORG_SLUG;

  if (!sentryToken || !sentryOrg) {
    console.error("Error: SENTRY_PERSONAL_TOKEN and SENTRY_ORG_SLUG must be set in .env.local");
    process.exit(1);
  }

  const url = `https://sentry.io/api/0/projects/${sentryOrg}/website/issues/?query=${encodeURIComponent(query)}&sort=date&limit=100`;

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${sentryToken}` },
  });

  if (!response.ok) {
    console.error(`Error: HTTP ${response.status}`);
    console.error(await response.text());
    process.exit(1);
  }

  const issues = await response.json();

  if (!Array.isArray(issues)) {
    console.error("Unexpected response:", JSON.stringify(issues, null, 2));
    process.exit(1);
  }

  console.log(`Found ${issues.length} issues\n`);

  for (const issue of issues) {
    console.log(`${issue.shortId}  ${issue.title}`);
    console.log(`  Count: ${issue.count}  Users: ${issue.userCount}  Last: ${issue.lastSeen}`);
    console.log();
  }
};

main();
