export const coverageDashboardHelp = {
  title: "Coverage Dashboard Help",
  description:
    "This dashboard shows test coverage data for repositories where GitAuto is installed and helps you create GitHub issues for improving test coverage. Currently in alpha and supports Jest and Flutter test coverage.",
  steps: [
    {
      title: "Prerequisites",
      content: "Your repository must meet these requirements:",
      subItems: [
        "GitHub Actions workflow.yml file must be configured",
        "For Jest: Workflow must include 'jest --coverage --coverageReporters=\"lcov\"' command",
        "For Flutter: Workflow must include 'flutter test --coverage' command",
        "Coverage report must be uploaded as an artifact",
      ],
      note: "Supports Jest and Flutter projects. For detailed setup instructions, see our guides [here](/blog/how-to-detect-low-test-coverage-files-in-jest) for Jest and [here](/blog/how-to-detect-low-test-coverage-files-in-flutter) for Flutter.",
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
