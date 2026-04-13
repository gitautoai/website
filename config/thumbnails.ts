import { BASE_URL } from "@/config/urls";

export const THUMBNAILS = {
  HOME: `${BASE_URL}/og/home.png`,
  CONTACT: `${BASE_URL}/og/contact.png`,
  PRICING: `${BASE_URL}/og/pricing.png`,

  // Dashboard
  DASHBOARD: {
    GENERAL: `${BASE_URL}/og/dashboard-general.png`,
    COVERAGE_TRENDS: `${BASE_URL}/og/dashboard-coverage-trends.png`,
    FILE_COVERAGE: `${BASE_URL}/og/dashboard-file-coverage.png`,
    CREDITS: `${BASE_URL}/og/dashboard-credits.png`,
    PRS: `${BASE_URL}/og/dashboard-prs.png`,
    USAGE: `${BASE_URL}/og/dashboard-usage.png`,
    TRIGGERS: `${BASE_URL}/og/dashboard-triggers.png`,
    ACTIONS: `${BASE_URL}/og/dashboard-actions.png`,
    REFERENCES: `${BASE_URL}/og/dashboard-references.png`,
    RULES: `${BASE_URL}/og/dashboard-rules.png`,
    INTEGRATIONS: {
      CIRCLECI: `${BASE_URL}/og/dashboard-integrations-circleci.png`,
      NPM: `${BASE_URL}/og/dashboard-integrations-npm.png`,
    },
  },

  // Documentation
  DOCS: {
    INDEX: `${BASE_URL}/og/docs.png`,
    ACTIONS: {
      AUTO_MERGE: `${BASE_URL}/og/docs-actions-auto-merge.png`,
    },
    GETTING_STARTED: {
      INSTALLATION: `${BASE_URL}/og/docs-getting-started-installation.png`,
    },
    COVERAGE: {
      INDEX: `${BASE_URL}/og/docs-coverage.png`,
      PYTHON: `${BASE_URL}/og/docs-coverage-python.png`,
      JAVASCRIPT: `${BASE_URL}/og/docs-coverage-javascript.png`,
      JAVA: `${BASE_URL}/og/docs-coverage-java.png`,
      GO: `${BASE_URL}/og/docs-coverage-go.png`,
      PHP: `${BASE_URL}/og/docs-coverage-php.png`,
      RUBY: `${BASE_URL}/og/docs-coverage-ruby.png`,
      FLUTTER: `${BASE_URL}/og/docs-coverage-flutter.png`,
      MULTI_LANGUAGE: `${BASE_URL}/og/docs-coverage-multi-language.png`,
      CHARTS: `${BASE_URL}/og/docs-coverage-charts.png`,
    },
    TRIGGERS: {
      INDEX: `${BASE_URL}/og/docs-triggers.png`,
      DASHBOARD: `${BASE_URL}/og/docs-triggers-dashboard.png`,
      REVIEW_COMMENT: `${BASE_URL}/og/docs-triggers-review-comment.png`,
      SCHEDULE: `${BASE_URL}/og/docs-triggers-schedule.png`,
      TEST_FAILURE: `${BASE_URL}/og/docs-triggers-test-failure.png`,
    },
    CUSTOMIZATION: {
      REPOSITORY_RULES: `${BASE_URL}/og/docs-customization-repository-rules.png`,
    },
    INTEGRATIONS: {
      CIRCLECI: `${BASE_URL}/og/docs-integrations-circleci.png`,
      NPM: `${BASE_URL}/og/docs-integrations-npm.png`,
    },
    HOW_IT_WORKS: {
      INDEX: `${BASE_URL}/og/docs-how-it-works.png`,
      CONTEXT_ENRICHMENT: `${BASE_URL}/og/docs-how-it-works-context-enrichment.png`,
      OUTPUT_AUTO_CORRECTION: `${BASE_URL}/og/docs-how-it-works-output-auto-correction.png`,
      QUALITY_VERIFICATION: `${BASE_URL}/og/docs-how-it-works-quality-verification.png`,
      SAFETY_GUARDRAILS: `${BASE_URL}/og/docs-how-it-works-safety-guardrails.png`,
      TOKEN_COST_MANAGEMENT: `${BASE_URL}/og/docs-how-it-works-token-cost-management.png`,
      RESILIENCE_RECOVERY: `${BASE_URL}/og/docs-how-it-works-resilience-recovery.png`,
      HALLUCINATION_PREVENTION: `${BASE_URL}/og/docs-how-it-works-hallucination-prevention.png`,
    },
  },

  // Blog
  BLOG: {
    INDEX: `${BASE_URL}/og/blog.png`,
  },
} as const;
