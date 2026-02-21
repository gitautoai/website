import { isPrd } from "@/config";
import { GITHUB_CLIENT_ID } from "@/config/github";

// URLs
export const DOMAIN = "gitauto.ai";
export const BASE_URL = isPrd ? `https://${DOMAIN}` : "http://localhost:4000";

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
  CONTACT: "/contact",
  PRICING_DETAILS: "/pricing",
  SETTINGS: {
    INDEX: "/settings",
    ACTIONS: "/settings/actions",
    REFERENCES: "/settings/references",
    RULES: "/settings/rules",
    TRIGGERS: "/settings/triggers",
    INTEGRATIONS: {
      CIRCLECI: "/settings/integrations/circleci",
      JIRA: "/settings/integrations/jira",
      NPM: "/settings/integrations/npm",
    },
  },
  DASHBOARD: {
    CHARTS: "/dashboard/charts",
    COVERAGE: "/dashboard/coverage",
    CREDITS: "/dashboard/credits",
    PRS: "/dashboard/prs",
    USAGE: "/dashboard/usage",
  },
  BLOG: "/blog",
  DOCS: {
    ACTIONS: {
      AUTO_MERGE: "/docs/actions/auto-merge",
    },
    GETTING_STARTED: {
      INSTALLATION: "/docs/getting-started/installation",
      SETUP: "/docs/getting-started/setup",
    },
    COVERAGE: {
      OVERVIEW: "/docs/coverage",
      PYTHON: "/docs/coverage/python",
      JAVASCRIPT: "/docs/coverage/javascript",
      JAVA: "/docs/coverage/java",
      GO: "/docs/coverage/go",
      PHP: "/docs/coverage/php",
      RUBY: "/docs/coverage/ruby",
      FLUTTER: "/docs/coverage/flutter",
      MULTI_LANGUAGE: "/docs/coverage/multi-language",
      CHARTS: "/docs/coverage/charts",
    },
    TRIGGERS: {
      OVERVIEW: "/docs/triggers",
      DASHBOARD: "/docs/triggers/dashboard",
      ISSUE_LABEL: "/docs/triggers/issue-label",
      REVIEW_COMMENT: "/docs/triggers/review-comment",
      SCHEDULE: "/docs/triggers/schedule",
      TEST_FAILURE: "/docs/triggers/test-failure",
    },
    CUSTOMIZATION: {
      PARENT_ISSUE_RULES: "/docs/customization/parent-issue-rules",
      REPOSITORY_RULES: "/docs/customization/repository-rules",
    },
    INTEGRATIONS: {
      CIRCLECI: "/docs/integrations/circleci",
      NPM: "/docs/integrations/npm",
    },
  },
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
} as const;

// Authentication
export const DEFAULT_SIGNIN_REDIRECT = RELATIVE_URLS.DASHBOARD.CHARTS;

export const ABSOLUTE_URLS = {
  CALENDLY: "https://calendly.com/gitauto/wes",
  GITAUTO: {
    BLOG: `${BASE_URL}${RELATIVE_URLS.BLOG}`,
    CANCEL_FALLBACK: `${BASE_URL}?success=false`,
    CONTACT: `${BASE_URL}${RELATIVE_URLS.CONTACT}`,
    DASHBOARD: {
      CHARTS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.CHARTS}`,
      COVERAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.COVERAGE}`,
      CREDITS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.CREDITS}`,
      CREDITS_SUCCESS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.CREDITS}?success=true`,
      PRS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.PRS}`,
      USAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.USAGE}`,
    },
    DOCS: {
      ACTIONS: {
        AUTO_MERGE: `${BASE_URL}${RELATIVE_URLS.DOCS.ACTIONS.AUTO_MERGE}`,
      },
      GETTING_STARTED: {
        INSTALLATION: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION}`,
      },
      COVERAGE: {
        OVERVIEW: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW}`,
        PYTHON: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.PYTHON}`,
        JAVASCRIPT: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT}`,
        JAVA: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.JAVA}`,
        GO: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.GO}`,
        PHP: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.PHP}`,
        RUBY: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.RUBY}`,
        FLUTTER: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.FLUTTER}`,
        MULTI_LANGUAGE: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE}`,
        CHARTS: `${BASE_URL}${RELATIVE_URLS.DOCS.COVERAGE.CHARTS}`,
      },
      TRIGGERS: {
        OVERVIEW: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW}`,
        DASHBOARD: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD}`,
        ISSUE_LABEL: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.ISSUE_LABEL}`,
        REVIEW_COMMENT: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}`,
        SCHEDULE: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}`,
        TEST_FAILURE: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}`,
      },
      CUSTOMIZATION: {
        PARENT_ISSUE_RULES: `${BASE_URL}${RELATIVE_URLS.DOCS.CUSTOMIZATION.PARENT_ISSUE_RULES}`,
        REPOSITORY_RULES: `${BASE_URL}${RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES}`,
      },
      INTEGRATIONS: {
        CIRCLECI: `${BASE_URL}${RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI}`,
        NPM: `${BASE_URL}${RELATIVE_URLS.DOCS.INTEGRATIONS.NPM}`,
      },
    },
    LOGO: `${BASE_URL}/logo.png`,
    PRICING: `${BASE_URL}${RELATIVE_URLS.PRICING}`,
    PRICING_DETAILS: `${BASE_URL}${RELATIVE_URLS.PRICING_DETAILS}`,
    PRIVACY_POLICY: `${BASE_URL}${RELATIVE_URLS.PRIVACY_POLICY}`,
    TERMS_OF_SERVICE: `${BASE_URL}${RELATIVE_URLS.TERMS_OF_SERVICE}`,
    SETTINGS: {
      INDEX: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INDEX}`,
      ACTIONS: `${BASE_URL}${RELATIVE_URLS.SETTINGS.ACTIONS}`,
      REFERENCES: `${BASE_URL}${RELATIVE_URLS.SETTINGS.REFERENCES}`,
      RULES: `${BASE_URL}${RELATIVE_URLS.SETTINGS.RULES}`,
      TRIGGERS: `${BASE_URL}${RELATIVE_URLS.SETTINGS.TRIGGERS}`,
      INTEGRATIONS: {
        CIRCLECI: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INTEGRATIONS.CIRCLECI}`,
        JIRA: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INTEGRATIONS.JIRA}`,
        NPM: `${BASE_URL}${RELATIVE_URLS.SETTINGS.INTEGRATIONS.NPM}`,
      },
    },
  },
  GITHUB: {
    EMAIL_SETTING: "https://github.com/settings/emails",
    MARKETPLACE: "https://github.com/marketplace/gitauto-ai",
    INSTALL_GITAUTO: "https://github.com/apps/gitauto-ai/installations/new",
    INSTALL_GITAUTO_DEV: "https://github.com/apps/gitauto-for-dev/installations/new",
    INSTALLED_APPS: "https://github.com/settings/installations",
    OAUTH_GRANT: `https://github.com/settings/connections/applications/${GITHUB_CLIENT_ID}`,
    ORGANIZATION: "https://github.com/gitautoai",
  },
  LINKEDIN: "https://www.linkedin.com/company/gitauto",
  OPENAI: {
    PRIVACY: "https://openai.com/enterprise-privacy/",
  },
  TWITTER: "https://twitter.com/gitautoai",
  YOUTUBE: {
    HOME: "https://www.youtube.com/@gitauto",
    DEMO: "https://www.youtube.com/watch?v=jmTQuuJAs38",
    DEMO_EMBED:
      "https://www.youtube.com/embed/jmTQuuJAs38?autoplay=1&mute=1&loop=1&playlist=jmTQuuJAs38&rel=0&cc_load_policy=1",
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
