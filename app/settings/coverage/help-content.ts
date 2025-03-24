export const coverageDashboardHelp = {
  title: "Coverage Dashboard Help",
  description:
    "This dashboard shows test coverage data for repositories where GitAuto is installed and helps you create GitHub issues for improving test coverage.",
  steps: [
    {
      title: "Select Repository",
      content: "Select an Organization and Repository",
    },
    {
      title: "Refresh Coverage",
      content: 'For first-time use, click "Refresh Coverage" in the pink Actions menu',
    },
    {
      title: "Wait for Analysis",
      content: "The refresh process takes 5-10 minutes. GitAuto will:",
      subItems: [
        "Clone the repository",
        "Install packages",
        "Build the project",
        "Run tests",
        "Generate and parse test reports",
        "Display coverage data here",
      ],
      note: "Coverage analysis does not consume credits",
    },
    {
      title: "Create Issues",
      content:
        "Consider creating issues for files with low coverage that contain important functions or classes. GitAuto can be assigned to them.",
      note: "Issue creation does not consume credits",
    },
  ],
};
