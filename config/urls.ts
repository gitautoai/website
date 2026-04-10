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
  SOLUTION: "/solution",
  ROI: {
    CALCULATOR: "/roi/calculator",
    METHODOLOGY: "/roi/methodology",
  },
  DASHBOARD: {
    GENERAL: "/dashboard/general",
    COVERAGE_TRENDS: "/dashboard/coverage-trends",
    FILE_COVERAGE: "/dashboard/file-coverage",
    CREDITS: "/dashboard/credits",
    PRS: "/dashboard/prs",
    USAGE: "/dashboard/usage",
    TRIGGERS: "/dashboard/triggers",
    ACTIONS: "/dashboard/actions",
    REFERENCES: "/dashboard/references",
    RULES: "/dashboard/rules",
    INTEGRATIONS: {
      CIRCLECI: "/dashboard/integrations/circleci",
      NPM: "/dashboard/integrations/npm",
    },
  },
  BLOG: "/blog",
  DOCS: {
    ACTIONS: {
      AUTO_MERGE: "/docs/actions/auto-merge",
      PR_BODY_SUMMARY: "/docs/actions/pr-body-summary",
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
      REVIEW_COMMENT: "/docs/triggers/review-comment",
      SCHEDULE: "/docs/triggers/schedule",
      TEST_FAILURE: "/docs/triggers/test-failure",
    },
    CUSTOMIZATION: {
      GITAUTO_MD: "/docs/customization/gitauto-md",
      OUTPUT_LANGUAGE: "/docs/customization/output-language",
      REPOSITORY_RULES: "/docs/customization/repository-rules",
    },
    INTEGRATIONS: {
      CIRCLECI: "/docs/integrations/circleci",
      NPM: "/docs/integrations/npm",
    },
    HOW_IT_WORKS: {
      OVERVIEW: "/docs/how-it-works",
      CONTEXT_ENRICHMENT: {
        LINE_NUMBERS: "/docs/how-it-works/context-enrichment/line-numbers",
        FULL_FILE_READS: "/docs/how-it-works/context-enrichment/full-file-reads",
        TEST_FILE_PRELOADING: "/docs/how-it-works/context-enrichment/test-file-preloading",
        TEST_NAMING_DETECTION: "/docs/how-it-works/context-enrichment/test-naming-detection",
        ERROR_BASELINES: "/docs/how-it-works/context-enrichment/error-baselines",
        CI_LOG_CLEANING: "/docs/how-it-works/context-enrichment/ci-log-cleaning",
        TRIGGER_SPECIFIC_PROMPTS: "/docs/how-it-works/context-enrichment/trigger-specific-prompts",
        CODING_STANDARDS: "/docs/how-it-works/context-enrichment/coding-standards",
      },
      OUTPUT_AUTO_CORRECTION: {
        DIFF_HUNK_REPAIR: "/docs/how-it-works/output-auto-correction/diff-hunk-repair",
        DIFF_PREFIX_REPAIR: "/docs/how-it-works/output-auto-correction/diff-prefix-repair",
        TOOL_NAME_CORRECTION: "/docs/how-it-works/output-auto-correction/tool-name-correction",
        TOOL_ARGUMENT_CORRECTION:
          "/docs/how-it-works/output-auto-correction/tool-argument-correction",
        IMPORT_SORTING: "/docs/how-it-works/output-auto-correction/import-sorting",
        TRAILING_SPACE_REMOVAL: "/docs/how-it-works/output-auto-correction/trailing-space-removal",
        FINAL_NEWLINE: "/docs/how-it-works/output-auto-correction/final-newline",
        LINE_ENDING_PRESERVATION:
          "/docs/how-it-works/output-auto-correction/line-ending-preservation",
        SANITIZE_TOOL_ARGUMENTS:
          "/docs/how-it-works/output-auto-correction/sanitize-tool-arguments",
        LINT_DISABLE_HEADERS: "/docs/how-it-works/output-auto-correction/lint-disable-headers",
      },
      QUALITY_VERIFICATION: {
        FORMATTING: "/docs/how-it-works/quality-verification/formatting",
        LINTING: "/docs/how-it-works/quality-verification/linting",
        TYPE_CHECKING: "/docs/how-it-works/quality-verification/type-checking",
        TEST_EXECUTION: "/docs/how-it-works/quality-verification/test-execution",
        COVERAGE_ENFORCEMENT: "/docs/how-it-works/quality-verification/coverage-enforcement",
        PHPUNIT_SUPPORT: "/docs/how-it-works/quality-verification/phpunit-support",
        SNAPSHOT_AUTO_UPDATE: "/docs/how-it-works/quality-verification/snapshot-auto-update",
        UNTESTABLE_DETECTION: "/docs/how-it-works/quality-verification/untestable-detection",
        SHOULD_SKIP_DETECTION: "/docs/how-it-works/quality-verification/should-skip-detection",
        DEAD_CODE_REMOVAL: "/docs/how-it-works/quality-verification/dead-code-removal",
        QUALITY_CHECK_SCORING: "/docs/how-it-works/quality-verification/quality-check-scoring",
        QUALITY_CHECKLIST: "/docs/how-it-works/quality-verification/quality-checklist",
      },
      SAFETY_GUARDRAILS: {
        FILE_EDIT_RESTRICTIONS: "/docs/how-it-works/safety-guardrails/file-edit-restrictions",
        TEMPERATURE_ZERO: "/docs/how-it-works/safety-guardrails/temperature-zero",
        PR_BRANCH_CHECKS: "/docs/how-it-works/safety-guardrails/pr-branch-checks",
        RACE_CONDITION_PREVENTION: "/docs/how-it-works/safety-guardrails/race-condition-prevention",
        BOT_LOOP_PREVENTION: "/docs/how-it-works/safety-guardrails/bot-loop-prevention",
        WEBHOOK_DEDUPLICATION: "/docs/how-it-works/safety-guardrails/webhook-deduplication",
        DUPLICATE_ERROR_HASHING: "/docs/how-it-works/safety-guardrails/duplicate-error-hashing",
        INFRASTRUCTURE_FAILURE_DETECTION:
          "/docs/how-it-works/safety-guardrails/infrastructure-failure-detection",
        STRICT_TOOL_SCHEMAS: "/docs/how-it-works/safety-guardrails/strict-tool-schemas",
        NO_CHANGE_DETECTION: "/docs/how-it-works/safety-guardrails/no-change-detection",
      },
      TOKEN_COST_MANAGEMENT: {
        TOKEN_TRIMMING: "/docs/how-it-works/token-cost-management/token-trimming",
        OUTDATED_DIFF_REMOVAL: "/docs/how-it-works/token-cost-management/outdated-diff-removal",
        STALE_FILE_REPLACEMENT: "/docs/how-it-works/token-cost-management/stale-file-replacement",
        SKIP_CI_INTERMEDIATE: "/docs/how-it-works/token-cost-management/skip-ci-intermediate",
        CI_LOG_DEDUP: "/docs/how-it-works/token-cost-management/ci-log-dedup",
        WEB_FETCH_SUMMARIZATION: "/docs/how-it-works/token-cost-management/web-fetch-summarization",
      },
      RESILIENCE_RECOVERY: {
        MODEL_FALLBACK: "/docs/how-it-works/resilience-recovery/model-fallback",
        OVERLOAD_RETRY: "/docs/how-it-works/resilience-recovery/overload-retry",
        FORCED_VERIFICATION: "/docs/how-it-works/resilience-recovery/forced-verification",
        ERROR_FILES_EDITABLE: "/docs/how-it-works/resilience-recovery/error-files-editable",
      },
      HALLUCINATION_PREVENTION: {
        WEB_SEARCH: "/docs/how-it-works/hallucination-prevention/web-search",
        URL_FETCHING: "/docs/how-it-works/hallucination-prevention/url-fetching",
        ANTI_HALLUCINATION_PROMPTS:
          "/docs/how-it-works/hallucination-prevention/anti-hallucination-prompts",
        GITAUTO_MD_RESTRICTIONS:
          "/docs/how-it-works/hallucination-prevention/gitauto-md-restrictions",
        REVIEW_RESPONSE_GUARDRAILS:
          "/docs/how-it-works/hallucination-prevention/review-response-guardrails",
      },
    },
  },
  PRIVACY_POLICY: "/privacy-policy",
  TERMS_OF_SERVICE: "/terms-of-service",
} as const;

// Authentication
export const DEFAULT_SIGNIN_REDIRECT = RELATIVE_URLS.DASHBOARD.COVERAGE_TRENDS;

export const ABSOLUTE_URLS = {
  CALENDLY: "https://calendly.com/gitauto/wes",
  GITAUTO: {
    BLOG: `${BASE_URL}${RELATIVE_URLS.BLOG}`,
    CANCEL_FALLBACK: `${BASE_URL}?success=false`,
    CONTACT: `${BASE_URL}${RELATIVE_URLS.CONTACT}`,
    DASHBOARD: {
      GENERAL: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.GENERAL}`,
      COVERAGE_TRENDS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.COVERAGE_TRENDS}`,
      FILE_COVERAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.FILE_COVERAGE}`,
      CREDITS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.CREDITS}`,
      CREDITS_SUCCESS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.CREDITS}?success=true`,
      PRS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.PRS}`,
      USAGE: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.USAGE}`,
      TRIGGERS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.TRIGGERS}`,
      ACTIONS: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.ACTIONS}`,
      REFERENCES: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.REFERENCES}`,
      RULES: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.RULES}`,
      INTEGRATIONS: {
        CIRCLECI: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.INTEGRATIONS.CIRCLECI}`,
        NPM: `${BASE_URL}${RELATIVE_URLS.DASHBOARD.INTEGRATIONS.NPM}`,
      },
    },
    DOCS: {
      ACTIONS: {
        AUTO_MERGE: `${BASE_URL}${RELATIVE_URLS.DOCS.ACTIONS.AUTO_MERGE}`,
        PR_BODY_SUMMARY: `${BASE_URL}${RELATIVE_URLS.DOCS.ACTIONS.PR_BODY_SUMMARY}`,
      },
      GETTING_STARTED: {
        INSTALLATION: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION}`,
        SETUP: `${BASE_URL}${RELATIVE_URLS.DOCS.GETTING_STARTED.SETUP}`,
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
        REVIEW_COMMENT: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}`,
        SCHEDULE: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}`,
        TEST_FAILURE: `${BASE_URL}${RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}`,
      },
      CUSTOMIZATION: {
        GITAUTO_MD: `${BASE_URL}${RELATIVE_URLS.DOCS.CUSTOMIZATION.GITAUTO_MD}`,
        OUTPUT_LANGUAGE: `${BASE_URL}${RELATIVE_URLS.DOCS.CUSTOMIZATION.OUTPUT_LANGUAGE}`,
        REPOSITORY_RULES: `${BASE_URL}${RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES}`,
      },
      INTEGRATIONS: {
        CIRCLECI: `${BASE_URL}${RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI}`,
        NPM: `${BASE_URL}${RELATIVE_URLS.DOCS.INTEGRATIONS.NPM}`,
      },
      HOW_IT_WORKS: {
        OVERVIEW: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OVERVIEW}`,
        CONTEXT_ENRICHMENT: {
          LINE_NUMBERS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS}`,
          FULL_FILE_READS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.FULL_FILE_READS}`,
          TEST_FILE_PRELOADING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING}`,
          TEST_NAMING_DETECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION}`,
          ERROR_BASELINES: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.ERROR_BASELINES}`,
          CI_LOG_CLEANING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING}`,
          TRIGGER_SPECIFIC_PROMPTS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS}`,
          CODING_STANDARDS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CODING_STANDARDS}`,
        },
        OUTPUT_AUTO_CORRECTION: {
          DIFF_HUNK_REPAIR: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR}`,
          DIFF_PREFIX_REPAIR: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR}`,
          TOOL_NAME_CORRECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION}`,
          TOOL_ARGUMENT_CORRECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION}`,
          IMPORT_SORTING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING}`,
          TRAILING_SPACE_REMOVAL: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL}`,
          FINAL_NEWLINE: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE}`,
          LINE_ENDING_PRESERVATION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION}`,
          SANITIZE_TOOL_ARGUMENTS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS}`,
          LINT_DISABLE_HEADERS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS}`,
        },
        QUALITY_VERIFICATION: {
          FORMATTING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING}`,
          LINTING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.LINTING}`,
          TYPE_CHECKING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING}`,
          TEST_EXECUTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TEST_EXECUTION}`,
          COVERAGE_ENFORCEMENT: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT}`,
          PHPUNIT_SUPPORT: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.PHPUNIT_SUPPORT}`,
          SNAPSHOT_AUTO_UPDATE: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE}`,
          UNTESTABLE_DETECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION}`,
          SHOULD_SKIP_DETECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION}`,
          DEAD_CODE_REMOVAL: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL}`,
          QUALITY_CHECK_SCORING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECK_SCORING}`,
          QUALITY_CHECKLIST: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.QUALITY_CHECKLIST}`,
        },
        SAFETY_GUARDRAILS: {
          FILE_EDIT_RESTRICTIONS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS}`,
          TEMPERATURE_ZERO: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO}`,
          PR_BRANCH_CHECKS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS}`,
          RACE_CONDITION_PREVENTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION}`,
          BOT_LOOP_PREVENTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION}`,
          WEBHOOK_DEDUPLICATION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION}`,
          DUPLICATE_ERROR_HASHING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING}`,
          INFRASTRUCTURE_FAILURE_DETECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION}`,
          STRICT_TOOL_SCHEMAS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS}`,
          NO_CHANGE_DETECTION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION}`,
        },
        TOKEN_COST_MANAGEMENT: {
          TOKEN_TRIMMING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING}`,
          OUTDATED_DIFF_REMOVAL: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL}`,
          STALE_FILE_REPLACEMENT: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT}`,
          SKIP_CI_INTERMEDIATE: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE}`,
          CI_LOG_DEDUP: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CI_LOG_DEDUP}`,
          WEB_FETCH_SUMMARIZATION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION}`,
        },
        RESILIENCE_RECOVERY: {
          MODEL_FALLBACK: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.MODEL_FALLBACK}`,
          OVERLOAD_RETRY: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.OVERLOAD_RETRY}`,
          FORCED_VERIFICATION: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION}`,
          ERROR_FILES_EDITABLE: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE}`,
        },
        HALLUCINATION_PREVENTION: {
          WEB_SEARCH: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.WEB_SEARCH}`,
          URL_FETCHING: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING}`,
          ANTI_HALLUCINATION_PROMPTS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS}`,
          GITAUTO_MD_RESTRICTIONS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS}`,
          REVIEW_RESPONSE_GUARDRAILS: `${BASE_URL}${RELATIVE_URLS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS}`,
        },
      },
    },
    LOGO: `${BASE_URL}/logo.png`,
    PRICING: `${BASE_URL}${RELATIVE_URLS.PRICING}`,
    SOLUTION: `${BASE_URL}${RELATIVE_URLS.SOLUTION}`,
    PRICING_DETAILS: `${BASE_URL}${RELATIVE_URLS.PRICING_DETAILS}`,
    ROI: {
      CALCULATOR: `${BASE_URL}${RELATIVE_URLS.ROI.CALCULATOR}`,
      METHODOLOGY: `${BASE_URL}${RELATIVE_URLS.ROI.METHODOLOGY}`,
    },
    PRIVACY_POLICY: `${BASE_URL}${RELATIVE_URLS.PRIVACY_POLICY}`,
    TERMS_OF_SERVICE: `${BASE_URL}${RELATIVE_URLS.TERMS_OF_SERVICE}`,
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
  TWITTER: "https://twitter.com/gitautoai",
  YOUTUBE: {
    HOME: "https://www.youtube.com/@gitauto",
    DEMO: "https://www.youtube.com/watch?v=jmTQuuJAs38",
    DEMO_EMBED:
      "https://www.youtube.com/embed/jmTQuuJAs38?autoplay=1&mute=1&loop=1&playlist=jmTQuuJAs38&rel=0&cc_load_policy=1",
  },
  ATLASSIAN: {
    MARKETPLACE: "https://marketplace.atlassian.com/apps/1236220/gitauto",
  },
} as const;

export const SNS_LINKS = {
  GitHub: ABSOLUTE_URLS.GITHUB.MARKETPLACE,
  LinkedIn: ABSOLUTE_URLS.LINKEDIN,
  Twitter: ABSOLUTE_URLS.TWITTER,
  YouTube: ABSOLUTE_URLS.YOUTUBE.HOME,
} as const;
