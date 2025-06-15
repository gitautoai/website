import { isPrd } from "@/config";

// URLs
export const BASE_URL = isPrd ? "https://gitauto.ai" : "http://localhost:4000";

export const RELATIVE_URLS = {
  // Top Page
  INDEX: "/",
  HERO: "/#hero",
  WHY_GITAUTO: "/#why-gitauto",
  WHAT_GITAUTO_DOES: "/#what-gitauto-does",
  HOW_IT_WORKS: "/#how-it-works",
  USE_CASES: "/#use-cases",
  HOW_TO_GET_STARTED: "/#how-to-get-started",
  PRICING: "/#pricing",
  FAQ: "/#faqs",

  // Other Pages
  PRICING_DETAILS: "/pricing",
  SETTINGS: {
    INDEX: "/settings",
    REFERENCES: "/settings/references",
    RULES: "/settings/rules",
    SCREENSHOTS: "/settings/screenshots",
    TRIGGERS: "/settings/triggers",
    INTEGRATIONS: {
      JIRA: "/settings/integrations/jira",
    },
  },
  DASHBOARD: {
    COVERAGE: "/dashboard/coverage",
    USAGE: "/dashboard/usage",
  },
  BLOG: "/blog",
  DOCS: {
    GETTING_STARTED: {
      INSTALLATION: "/docs/getting-started/installation",
      ISSUE_CHECKBOX_TRIGGER: "/docs/getting-started/issue-checkbox-trigger",
      ISSUE_LABEL_TRIGGER: "/docs/getting-started/issue-label-trigger",
      DASHBOARD_TRIGGER: "/docs/getting-started/dashboard-trigger",
      PARENT_ISSUE_RULES: "/docs/getting-started/parent-issue-rules",
    },
    COVERAGE: {
      OVERVIEW: "/docs/coverage",
      JAVASCRIPT: "/docs/coverage/javascript",
      PYTHON: "/docs/coverage/python",
      FLUTTER: "/docs/coverage/flutter",
    },
  },
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
} as const;

export const ABSOLUTE_URLS = {
  CALENDLY: "https://calendly.com/gitauto/wes",
  GITAUTO: {
    INDEX: BASE_URL,
    BLOG: `${BASE_URL}${RELATIVE_URLS.BLOG}`,
    COVERAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.COVERAGE}`,
    DOCS: {
      GETTING_STARTED: {
        INSTALLATION: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION}`,
        ISSUE_CHECKBOX_TRIGGER: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER}`,
        ISSUE_LABEL_TRIGGER: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER}`,
        DASHBOARD_TRIGGER: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER}`,
        PARENT_ISSUE_RULES: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.PARENT_ISSUE_RULES}`,
      },
      COVERAGE: {
        OVERVIEW: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW}`,
        JAVASCRIPT: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT}`,
        PYTHON: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.PYTHON}`,
        FLUTTER: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.FLUTTER}`,
      },
    },
    LOGO: `${BASE_URL}/logo.png`,
    PRICING: `${BASE_URL}${RELATIVE_URLS.PRICING}`,
    PRICING_DETAILS: `${BASE_URL}${RELATIVE_URLS.PRICING_DETAILS}`,
    SETTINGS: {
      INDEX: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INDEX}`,
      REFERENCES: `${BASE_URL}${RELATIVE_URLS.SETTINGS.REFERENCES}`,
      RULES: `${BASE_URL}${RELATIVE_URLS.SETTINGS.RULES}`,
      SCREENSHOTS: `${BASE_URL}${RELATIVE_URLS.SETTINGS.SCREENSHOTS}`,
      TRIGGERS: `${BASE_URL}${RELATIVE_URLS.SETTINGS.TRIGGERS}`,
      INTEGRATIONS: {
        JIRA: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INTEGRATIONS.JIRA}`,
      },
    },
    USAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.USAGE}`,
  },
  GITHUB: {
    EMAIL_SETTING: "https://github.com/settings/emails",
    MARKETPLACE: "https://github.com/marketplace/gitauto-ai",
    INSTALL_GITAUTO: "https://github.com/apps/gitauto-ai/installations/new",
    INSTALLED_APPS: "https://github.com/settings/installations",
    ORGANIZATION: "https://github.com/gitautoai",
  },
  LINKEDIN: "https://www.linkedin.com/company/gitauto",
  OPENAI: {
    PRIVACY: "https://openai.com/enterprise-privacy/",
  },
  TWITTER: "https://twitter.com/gitautoai",
  YOUTUBE: {
    HOME: "https://www.youtube.com/@gitauto",
    DEMO: "https://www.youtube.com/watch?v=gulhHrKCPxQ",
    INTRO_1MIN: "https://www.youtube.com/watch?v=oOzhH1rnVIk",
    INTRO_3MIN: "https://www.youtube.com/watch?v=QvzEzJ9GJzU&t=6s",
  },
  ATLASSIAN: {
    MARKETPLACE: "https://marketplace.atlassian.com/apps/1236220/gitauto",
  },
} as const;

export const SNS_LINKS = {
  GitHub: ABSOLUTE_URLS.GITHUB.MARKETPLACE,
  Atlassian: ABSOLUTE_URLS.ATLASSIAN.MARKETPLACE,
  LinkedIn: ABSOLUTE_URLS.LINKEDIN,
  Twitter: ABSOLUTE_URLS.TWITTER,
  YouTube: ABSOLUTE_URLS.YOUTUBE.HOME,
} as const;
