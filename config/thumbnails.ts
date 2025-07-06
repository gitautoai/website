import { BASE_URL } from "@/config/urls";

export const THUMBNAILS = {
  HOME: `${BASE_URL}/og/home.png`,
  CONTACT: `${BASE_URL}/og/contact.png`,
  PRICING: `${BASE_URL}/og/pricing.png`,

  // Dashboard
  DASHBOARD: {
    CHARTS: `${BASE_URL}/og/dashboard-charts.png`,
    COVERAGE: `${BASE_URL}/og/dashboard-coverage.png`,
    USAGE: `${BASE_URL}/og/dashboard-usage.png`,
  },

  // Settings
  SETTINGS: {
    INDEX: `${BASE_URL}/og/settings.png`,
    REFERENCES: `${BASE_URL}/og/settings-references.png`,
    RULES: `${BASE_URL}/og/settings-rules.png`,
    SCREENSHOTS: `${BASE_URL}/og/settings-screenshots.png`,
    TRIGGERS: `${BASE_URL}/og/settings-triggers.png`,
    INTEGRATIONS: {
      JIRA: `${BASE_URL}/og/settings-integrations-jira.png`,
    },
  },

  // Documentation
  DOCS: {
    GETTING_STARTED: {
      INSTALLATION: `${BASE_URL}/og/docs-getting-started-installation.png`,
    },
    COVERAGE: {
      INDEX: `${BASE_URL}/og/docs-coverage.png`,
      PYTHON: `${BASE_URL}/og/docs-coverage-python.png`,
      JAVASCRIPT: `${BASE_URL}/og/docs-coverage-javascript.png`,
      FLUTTER: `${BASE_URL}/og/docs-coverage-flutter.png`,
      CHARTS: `${BASE_URL}/og/docs-coverage-charts.png`,
    },
    TRIGGERS: {
      INDEX: `${BASE_URL}/og/docs-triggers.png`,
      DASHBOARD: `${BASE_URL}/og/docs-triggers-dashboard.png`,
      ISSUE_CHECKBOX: `${BASE_URL}/og/docs-triggers-issue-checkbox.png`,
      ISSUE_LABEL: `${BASE_URL}/og/docs-triggers-issue-label.png`,
      PR_CHANGE: `${BASE_URL}/og/docs-triggers-pr-change.png`,
      PR_MERGE: `${BASE_URL}/og/docs-triggers-pr-merge.png`,
      REVIEW_COMMENT: `${BASE_URL}/og/docs-triggers-review-comment.png`,
      SCHEDULE: `${BASE_URL}/og/docs-triggers-schedule.png`,
      TEST_FAILURE: `${BASE_URL}/og/docs-triggers-test-failure.png`,
    },
    CUSTOMIZATION: {
      PARENT_ISSUE_RULES: `${BASE_URL}/og/docs-customization-parent-issue-rules.png`,
      REPOSITORY_RULES: `${BASE_URL}/og/docs-customization-repository-rules.png`,
    },
  },

  // Blog
  BLOG: {
    INDEX: `${BASE_URL}/og/blog.png`,
  },
} as const;
