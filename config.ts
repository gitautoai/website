export const FREE_TIER_REQUEST_LIMIT = 5;
export const isPrd = process.env.NODE_ENV === "production";

// GitAuto Constants
export const PRODUCT_NAME = "GitAuto";
export const DESCRIPTION =
  "GitAuto is an AI Coding Agent for backend. Based on your GitHub issues and the file tree, GitAuto reads necessary files in your repository, writes code, conducts self-reviews, and creates pull requests. GitAuto is like a human engineer who works for you. Then you can review the PRs, provide comments, edit them, and lastly merge them, enabling more bug fixes and more features.";
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

// OpenAI Constants
export const OPENAI_FREE_TOKENS = "13K";
export const OPENAI_FREE_LINES = "2K";
export const OPENAI_FREE_FILES = 9;
export const OPENAI_MAX_TOKENS = "128K";
export const OPENAI_MAX_LINES = "18K";
export const OPENAI_MAX_FILES = 90;
export const OPENAI_MODEL_NAME = "GPT-4o";

// URLs
export const RELATIVE_URLS = {
  FAQ: "/#faq",
  HOW_IT_WORKS: "/#how-it-works",
  HOW_TO_GET_STARTED: "/#how-to-get-started",
  INDEX: "/",
  PRICING: "/#pricing",
  PRIVACY_POLICY: "/privacy-policy",
  REDIRECT_TO_INSTALL: "/redirect-to-install",
  TERMS_OF_SERVICE: "/terms-of-service",
  USE_CASES: "/#use-cases",
} as const;
export const URLS = {
  GITAUTO: {
    INDEX: "https://gitauto.ai",
  },
  GITHUB: {
    INSTALLED_APPS: "https://github.com/settings/installations",
  },
} as const;

export const config = {
  // Contants
  REDIRECT_GITHUB_APP_URL: "/redirect-to-install",
  PRIVACY_POLICY_URL: "/privacy-policy",
  TERMS_OF_SERVICE_URL: "/terms-of-service",

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
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  NEXT_PUBLIC_GITHUB_APP_URL: process.env.NEXT_PUBLIC_GITHUB_APP_URL || "",
};
