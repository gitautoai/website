import { BASE_URL } from "@/config/urls";

export const THUMBNAILS = {
  HOME: `${BASE_URL}/og/home.png`,
  PRICING: `${BASE_URL}/og/pricing.png`,

  // Dashboard
  DASHBOARD: {
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
      ISSUE_CHECKBOX_TRIGGER: `${BASE_URL}/og/docs-getting-started-issue-checkbox-trigger.png`,
      ISSUE_LABEL_TRIGGER: `${BASE_URL}/og/docs-getting-started-issue-label-trigger.png`,
      DASHBOARD_TRIGGER: `${BASE_URL}/og/docs-getting-started-dashboard-trigger.png`,
      PARENT_ISSUE_RULES: `${BASE_URL}/og/docs-getting-started-parent-issue-rules.png`,
    },
    COVERAGE: {
      INDEX: `${BASE_URL}/og/docs-coverage.png`,
      PYTHON: `${BASE_URL}/og/docs-coverage-python.png`,
      JAVASCRIPT: `${BASE_URL}/og/docs-coverage-javascript.png`,
      FLUTTER: `${BASE_URL}/og/docs-coverage-flutter.png`,
    },
  },

  // Blog
  BLOG: {
    INDEX: `${BASE_URL}/og/blog.png`,
  },
} as const;
