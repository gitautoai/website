export const isPrd = process.env.NODE_ENV === "production";

// GitAuto Constants
export const EMAIL = "info@gitauto.ai";
export const PRODUCT_ID = process.env.NEXT_PUBLIC_PRODUCT_ID;
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

// Atlassian Credentials
export const ATLASSIAN_CLIENT_ID = process.env.ATLASSIAN_CLIENT_ID || "";
export const ATLASSIAN_CLIENT_SECRET = process.env.ATLASSIAN_CLIENT_SECRET || "";
export const ATLASSIAN_API_DOMAIN = "api.atlassian.com";
export const ATLASSIAN_AUTHORIZE_URL = "https://auth.atlassian.com/authorize";
export const ATLASSIAN_REDIRECT_URI = process.env.ATLASSIAN_REDIRECT_URI || "";
export const ATLASSIAN_SCOPE = "read:jira-work";
export const ATLASSIAN_TOKEN_URL = "https://auth.atlassian.com/oauth/token";

// Stripe Credentials
export const STRIPE_STANDARD_PLAN_PRODUCT_ID = process.env.STRIPE_STANDARD_PLAN_PRODUCT_ID || "";

// Intercom Credentials
export const INTERCOM_SECRET_KEY = process.env.NEXT_PUBLIC_INTERCOM_SECRET_KEY || "";

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
