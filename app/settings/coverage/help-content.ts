export const coverageDashboardHelp = {
  title: "Coverage Dashboard Help",
  description:
    "This dashboard shows test coverage data for repositories where GitAuto is installed and helps you create GitHub issues for improving test coverage. Currently in alpha and only supports Flutter projects.",
  steps: [
    {
      title: "Prerequisites",
      content: "Your repository must meet these requirements:",
      subItems: [
        "GitHub Actions workflow.yml file must be configured",
        "Workflow must include 'flutter test --coverage' command",
        "Coverage report must be uploaded as an artifact",
      ],
      note: "Currently only Flutter projects are supported (alpha version)",
    },
    {
      title: "Select Repository",
      content: "Select an Organization and Repository",
    },
    {
      title: "Coverage Data",
      content: "Coverage data is automatically updated whenever your GitHub Actions workflow runs",
      note: "Coverage data is pulled from your workflow artifacts, ensuring it's always in sync with your latest tests",
    },
    {
      title: "Create Issues",
      content:
        "Consider creating issues for files with low coverage that contain important functions or classes. GitAuto can be assigned to them.",
      note: "Issue creation does not consume credits",
    },
  ],
};
