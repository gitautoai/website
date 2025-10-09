import { ANTHROPIC_MODEL_CLAUDE_OPUS, ANTHROPIC_MODEL_CLAUDE_SONNET } from "./anthropic";
import { GOOGLE_GEMINI } from "./google";
import { OPENAI_MODEL_O4_MINI } from "./openai";

// https://dashboard.stripe.com/test/prices/price_1QHCpnKUN3yUNaHzXNhxtQ8A
export const TEST_STANDARD_PLAN_PRICE_ID = "price_1QHCpnKUN3yUNaHzXNhxtQ8A";

// Test customer with active subscription in Stripe test mode
// https://dashboard.stripe.com/test/customers/cus_QO4R5vh6FJuN7t
export const TEST_LEGACY_CUSTOMER_ID = "cus_QO4R5vh6FJuN7t";

export const CREDIT_PRICING = {
  PER_PR: {
    AMOUNT_USD: 3,
  },
  PURCHASE_LIMITS: {
    MIN_AMOUNT_USD: 10,
    MAX_AMOUNT_USD: 5000,
    DEFAULT_AMOUNT_USD: 100,
  },
  AUTO_RELOAD: {
    DEFAULT_TRIGGER_USD: 10,
    DEFAULT_TARGET_USD: 100,
  },
  SPENDING_LIMIT: {
    DEFAULT_AMOUNT_USD: 5000,
  },
};

export const FREE_CREDITS_AMOUNT_USD = 10;
export const FREE_PRS_LIMIT = Math.floor(
  FREE_CREDITS_AMOUNT_USD / CREDIT_PRICING.PER_PR.AMOUNT_USD
);

export const FREE_FEATURES = [
  ANTHROPIC_MODEL_CLAUDE_SONNET,
  `$${FREE_CREDITS_AMOUNT_USD} free credits`,
  "1 repository",
  "Unlimited users",
  "Issue checkbox trigger",
  "Issue label trigger",
  "Dashboard trigger",
  "Test failure trigger (1 retry)",
  "Review comment trigger",
  "Limited schedule trigger",
  "PR change trigger",
  "PR merge trigger",
  "1 coverage report import",
  "1 reference URL/file",
  "Default branch only",
  "Default rules only",
];

export const STANDARD_FEATURES = [
  "Everything in Free plan",
  `Starting at $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD} for ${Math.floor(CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD / CREDIT_PRICING.PER_PR.AMOUNT_USD)} PRs`,
  "Purchase credits as needed",
  "Unlimited repositories",
  "Unlimited schedule trigger",
  "Unlimited test failure trigger retries",
  "Unlimited coverage report imports",
  "Unlimited reference URLs",
  "Unlimited reference files",
  "Custom repository rules",
  "Custom base branch",
];

export const ENTERPRISE_FEATURES = [
  "Everything in Standard plan",
  `${ANTHROPIC_MODEL_CLAUDE_OPUS}, ${ANTHROPIC_MODEL_CLAUDE_SONNET}, ${OPENAI_MODEL_O4_MINI}, ${GOOGLE_GEMINI}, and more`,
  "Self LLM API key",
  "Self hosting",
  "SAML / SSO",
  "Fine tuning with your data",
  "Dedicated Customer Support",
];

export const PRICE_FEATURES = [
  {
    name: "Pricing",
    description: "Pay-as-you-go with pre-paid credits.",
    free: "$0",
    standard: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR`,
    enterprise: "Custom pricing",
  },
  {
    name: "Minimum Purchase",
    description: "Smallest credit package you can buy.",
    free: "—",
    standard: `$${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}`,
    enterprise: "Custom",
  },
  {
    name: "Auto-reload",
    description: "Automatically purchase credits when balance is low.",
    free: "—",
    standard: `Customizable (default: reload when < $${CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TRIGGER_USD})`,
    enterprise: "Custom",
  },
  {
    name: "Spending Limits",
    description: "Maximum monthly spending cap for safety.",
    free: "—",
    standard: `Customizable (default: $${CREDIT_PRICING.SPENDING_LIMIT.DEFAULT_AMOUNT_USD}/month)`,
    enterprise: "Custom",
  },
  {
    name: "Credit Expiration",
    description: "How long credits remain valid after purchase.",
    free: "—",
    standard: "1 year",
    enterprise: "Custom",
  },
];

export const TABLE_FEATURES = [
  {
    category: "Base Features",
    items: [
      {
        name: "AI Models",
        description: "AI models used for test generation",
        free: ANTHROPIC_MODEL_CLAUDE_SONNET,
        standard: ANTHROPIC_MODEL_CLAUDE_SONNET,
        enterprise: `${ANTHROPIC_MODEL_CLAUDE_OPUS}, ${ANTHROPIC_MODEL_CLAUDE_SONNET}, ${OPENAI_MODEL_O4_MINI}, ${GOOGLE_GEMINI}, and more`,
      },
      {
        name: "Credits",
        description: "Credits for pull request generation",
        free: `$${FREE_CREDITS_AMOUNT_USD} free credits`,
        standard: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR`,
        enterprise: "Custom pricing",
      },
      {
        name: "Repositories",
        description: "Number of repositories GitAuto can work with",
        free: "1",
        standard: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Users",
        description: "Number of users who can access GitAuto",
        free: "Unlimited",
        standard: "Unlimited",
        enterprise: "Unlimited",
      },
    ],
  },
  {
    category: "Core Features",
    items: [
      {
        name: "Coverage Report Imports",
        description:
          "Import code coverage reports from your GitHub Actions artifacts. Number of reports you can import varies.",
        free: "1",
        standard: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Repository Rules",
        description: "Customize how GitAuto generates tests",
        free: "Default only",
        standard: "Customizable",
        enterprise: "Customizable",
      },
      {
        name: "Reference URLs",
        description:
          "Add URLs for GitAuto to understand your code. Number of reference URLs you can specify varies.",
        free: "1",
        standard: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Reference Files",
        description:
          "Add files for GitAuto to understand your code. Number of reference files you can specify varies.",
        free: "1",
        standard: "Unlimited",
        enterprise: "Unlimited",
      },
      {
        name: "Base Branch",
        description: "Branch used as base for new PRs",
        free: "Default branch only",
        standard: "Any branch",
        enterprise: "Any branch",
      },
    ],
  },
  {
    category: "Triggers",
    items: [
      {
        name: "Dashboard",
        description: "Trigger GitAuto from the dashboard by selecting files",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Issue Checkbox",
        description: "Trigger GitAuto by checking a box in an issue",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Issue Label",
        description: "Trigger GitAuto by adding the gitauto label to an issue",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Test Failure",
        description:
          "If GitAuto-generated tests fail in a pull request, GitAuto automatically fixes them",
        free: "1 retry per PR",
        standard: "Unlimited retries until fixed",
        enterprise: "Unlimited retries until fixed",
      },
      {
        name: "Review Comment",
        description: "Trigger GitAuto by adding a review comment to a pull request",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Schedule",
        description:
          "Add tests on a set schedule for the file with the lowest coverage and the fewest lines. Executions per day and start time vary.",
        free: "1x/day at 9:00 (fixed)",
        standard: "Up to 12x/day, any time",
        enterprise: "Unlimited",
      },
      {
        name: "PR Change",
        description: "Add missing tests after each change on the same PR",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "PR Merge",
        description: "Add missing tests after a PR is merged",
        free: true,
        standard: true,
        enterprise: true,
      },
    ],
  },
  {
    category: "Advanced Features",
    items: [
      {
        name: "Self LLM API Key",
        description: "Use your own API keys for AI models",
        free: false,
        standard: false,
        enterprise: true,
      },
      {
        name: "Self Hosting",
        description: "Host GitAuto on your own infrastructure",
        free: false,
        standard: false,
        enterprise: true,
      },
      {
        name: "SAML / SSO",
        description: "Enterprise single sign-on integration",
        free: false,
        standard: false,
        enterprise: true,
      },
      {
        name: "Fine Tuning",
        description: "Custom model training on your codebase",
        free: false,
        standard: false,
        enterprise: true,
      },
      {
        name: "Dedicated Support",
        description: "We use GitAuto directly in your repository to generate and add tests for you",
        free: false,
        standard: false,
        enterprise: true,
      },
    ],
  },
];
