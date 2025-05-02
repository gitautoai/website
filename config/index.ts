export const isPrd = process.env.NODE_ENV === "production";

// GitAuto Constants
export const EMAIL = "info@gitauto.ai";
export const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID
export const PRODUCT_NAME = "GitAuto";
export const DESCRIPTION =
  "GitAuto, an AI Coding Agent, helps engineering teams facing resource constraints and hiring challenges to fix more bugs and ship more features by automatically writing code and creating GitHub pull requests from your GitHub and Jira issues every day.";
export const KEYWORDS = [
  "AI",
  "artificial intelligence",
  "coding",
  "pull requests",
  "github",
  "git",
  "gitauto",
  "git auto",
  "git-auto",
  "automatic pull requests",
  "automatic prs",
  "automatic pr",
  "automatic pr for bugs",
  "automatic pr for issues",
];
export const TAGLINES = [
  "Have GitAuto write your code.",
  "Have GitAuto resolve your issues.",
  "Have GitAuto create pull requests.",
  "Have GitAuto write unit test cases.",
  "Have GitAuto write integration test cases.",
  "Have GitAuto write E2E test cases.",
  "Have GitAuto fix bugs from error logs.",
  "Hire GitAuto to fill your resource gaps.",
  "Assign GitAuto to your open issues.",
];

// Atlassian Credentials
export const ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || "";
export const ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || "";
export const ATLASSIAN_API_DOMAIN = "api.atlassian.com";
export const ATLASSIAN_AUTHORIZE_URL = "https://auth.atlassian.com/authorize";
export const ATLASSIAN_REDIRECT_URI = process.env.ATLASSIAN_REDIRECT_URI || "";
export const ATLASSIAN_SCOPE = "read:jira-work";
export const ATLASSIAN_TOKEN_URL = "https://auth.atlassian.com/oauth/token";

// OpenAI Credentials
export const OPENAI_FREE_TOKENS = "13K";
export const OPENAI_FREE_LINES = "2K";
export const OPENAI_FREE_FILES = 9;
export const OPENAI_MAX_TOKENS = "128K";
export const OPENAI_MAX_LINES = "18K";
export const OPENAI_MAX_FILES = 90;
export const OPENAI_MODEL_NAME = "GPT-4o";
export const OPENAI_MODEL_GPT_4O_MINI = "GPT-4o-mini";
export const OPENAI_MODEL_GPT_4O = "GPT-4o";
export const OPENAI_MODEL_O1_MINI = "o1-mini";
export const OPENAI_MODEL_O1 = "o1";
export const OPENAI_MODEL_O3_MINI = "o3-mini";

// Stripe Credentials
export const STRIPE_STANDARD_PLAN_PRODUCT_ID = process.env.STRIPE_STANDARD_PLAN_PRODUCT_ID || "";

// Intercom Credentials
export const INTERCOM_SECRET_KEY = process.env.NEXT_PUBLIC_INTERCOM_SECRET_KEY || "";

// URLs
export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "";
export const RELATIVE_URLS = {
  BLOG: "/blog",
  FAQ: "/#faqs",
  HOW_IT_WORKS: "/#how-it-works",
  HOW_TO_GET_STARTED: "/#how-to-get-started",
  INDEX: "/",
  PRICING: "/#pricing",
  PRIVACY_POLICY: "/privacy-policy",
  SETTINGS: "/settings",
  COVERAGES: "/dashboard/coverage",
  TERMS_OF_SERVICE: "/terms-of-service",
  USE_CASES: "/#use-cases",
  DOCS: "/docs/coverage",
} as const;
export const ABSOLUTE_URLS = {
  CALENDLY: "https://calendly.com/gitauto/30min",
  GITAUTO: {
    INDEX: "https://gitauto.ai",
    COVERAGES: `${NEXT_PUBLIC_SITE_URL}${RELATIVE_URLS.COVERAGES}`,
    PRICING: `${NEXT_PUBLIC_SITE_URL}${RELATIVE_URLS.PRICING}`,
    THUMBNAIL: "https://gitauto.ai/homepage/thumbnail.jpg",
  },
  GITHUB: {
    EMAIL_SETTING: "https://github.com/settings/emails",
    MARKETPLACE: "https://github.com/marketplace/gitauto-ai",
    INSTALL_GITAUTO: "https://github.com/apps/gitauto-ai",
    INSTALLED_APPS: "https://github.com/settings/installations",
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

// HTML or CSS Classes
export const REL = "noopener noreferrer"; // Prevents the new page from having access to the window.opener property

export const config = {
  // Authentication
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || "",
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || "",

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || "",
  STRIPE_FREE_TIER_PRICE_ID: process.env.STRIPE_FREE_TIER_PRICE_ID || "",
  STRIPE_STANDARD_PLAN_PRODUCT_ID: process.env.STRIPE_STANDARD_PLAN_PRODUCT_ID || "",
  STRIPE_STANDARD_PLAN_MONTHLY_PRICE_ID: process.env.STRIPE_STANDARD_PLAN_MONTHLY_PRICE_ID || "",
  STRIPE_STANDARD_PLAN_YEARLY_PRICE_ID: process.env.STRIPE_STANDARD_PLAN_YEARLY_PRICE_ID || "",

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || "",

  // Environment Specifcs
  NODE_ENV: process.env.NODE_ENV || "",
  NEXT_PUBLIC_GITHUB_APP_URL: process.env.NEXT_PUBLIC_GITHUB_APP_URL || "",
};
