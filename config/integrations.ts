export const INPUT_PLATFORMS = [
  { name: "Jira" },
  { name: "Asana" },
  { name: "Monday.com" },
  { name: "ServiceNow" },
  { name: "YouTrack" },
  { name: "Google Sheet" },
  // { name: "ClickUp" },
  // { name: "Wrike" },
  // { name: "Zoho Projects" },
  // { name: "Teamwork" },
  // { name: "Trello" },
] as const;

export const OUTPUT_PLATFORMS = [
  { name: "GitHub" },
  { name: "GitLab" },
  { name: "BitBucket" },
  { name: "Gerrit" },
  { name: "Azure DevOps" },
  { name: "AWS CodeCommit" },
  // { name: "SourceForge" },
  // { name: "Gitea" },
  // { name: "GitKraken" },
  // { name: "Launchpad" },
] as const;
