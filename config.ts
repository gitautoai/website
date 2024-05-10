import dotenv from "dotenv";
dotenv.config();

// TODO not working because it works on both client and server side, resulting in client side error.
function checkVar(variable: string) {
  const thisVariable = process.env[variable];
  console.log("THIS VAR: ", thisVariable, variable);
  if (!thisVariable) {
    throw new Error(`Variable ${thisVariable} is not defined`);
  }
  return thisVariable;
}

const config = {
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
  STRIPE_STANDARD_PLAN_PRICE_ID:
    process.env.STRIPE_STANDARD_PLAN_PRICE_ID || "",

  // PostHog
  NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY || "",
  NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST || "",

  // Environment Specifcs
  NODE_ENV: process.env.NODE_ENV || "",
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "",
  NEXT_PUBLIC_GITHUB_APP_URL: process.env.NEXT_PUBLIC_GITHUB_APP_URL || "",

  // Testing Variables
  OWNER_ID: -100,
  USER_ID: -100,
  INSTALLATION_ID: -100,
  OWNER_NAME: "web-ownername-test",
  OWNER_TYPE: "Organization",
  USER_NAME: "web-username-test",
  UNIQUE_ISSUE_ID: "O/web-gitautoai/test#100",
};

export default config;
