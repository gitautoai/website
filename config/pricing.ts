import { ANTHROPIC_MODEL_CLAUDE_OPUS, ANTHROPIC_MODEL_CLAUDE_SONNET } from "./anthropic";

// https://dashboard.stripe.com/test/prices/price_1QHCpnKUN3yUNaHzXNhxtQ8A
export const TEST_STANDARD_PLAN_PRICE_ID = "price_1QHCpnKUN3yUNaHzXNhxtQ8A";

// Test customer with active subscription in Stripe test mode
// https://dashboard.stripe.com/test/customers/cus_QO4R5vh6FJuN7t
export const TEST_LEGACY_CUSTOMER_ID = "cus_QO4R5vh6FJuN7t";

export const CREDIT_PRICING = {
  PER_PR: {
    AMOUNT_USD: 7,
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

export const FREE_CREDITS_AMOUNT_USD = CREDIT_PRICING.PER_PR.AMOUNT_USD * 3;
export const FREE_PRS_LIMIT = Math.floor(
  FREE_CREDITS_AMOUNT_USD / CREDIT_PRICING.PER_PR.AMOUNT_USD,
);

export const PRICE_FEATURES = [
  {
    name: "Pricing",
    description: "Pay-as-you-go with pre-paid credits.",
    free: "$0",
    standard: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR`,
  },
  {
    name: "Minimum Purchase",
    description: "Smallest credit package you can buy.",
    free: "—",
    standard: `$${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}`,
  },
  {
    name: "Auto-reload",
    description: "Automatically purchase credits when balance is low.",
    free: "—",
    standard: `Customizable (default: reload when < $${CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TRIGGER_USD})`,
  },
  {
    name: "Spending Limits",
    description: "Maximum monthly spending cap for safety.",
    free: "—",
    standard: `Customizable (default: $${CREDIT_PRICING.SPENDING_LIMIT.DEFAULT_AMOUNT_USD}/month)`,
  },
  {
    name: "Credit Expiration",
    description: "How long credits remain valid after purchase.",
    free: "—",
    standard: "1 year",
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
        standard: ANTHROPIC_MODEL_CLAUDE_OPUS,
      },
      {
        name: "Credits",
        description: "Credits for pull request generation",
        free: `$${FREE_CREDITS_AMOUNT_USD} free credits`,
        standard: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR`,
      },
      {
        name: "Repositories",
        description: "Number of repositories GitAuto can work with",
        free: "1",
        standard: "Unlimited",
      },
      {
        name: "Users",
        description: "Number of users who can access GitAuto",
        free: "1",
        standard: "Unlimited",
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
      },
      {
        name: "Repository Rules",
        description: "Customize how GitAuto generates tests",
        free: "Default only",
        standard: "Customizable",
      },
      {
        name: "Reference URLs",
        description:
          "Add URLs for GitAuto to understand your code. Number of reference URLs you can specify varies.",
        free: "1",
        standard: "Unlimited",
      },
      {
        name: "Reference Files",
        description:
          "Add files for GitAuto to understand your code. Number of reference files you can specify varies.",
        free: "1",
        standard: "Unlimited",
      },
      {
        name: "Base Branch",
        description: "Branch used as base for new PRs",
        free: "Default branch only",
        standard: "Any branch",
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
      },
      {
        name: "Issue Checkbox",
        description: "Trigger GitAuto by checking a box in an issue",
        free: true,
        standard: true,
      },
      {
        name: "Issue Label",
        description: "Trigger GitAuto by adding the gitauto label to an issue",
        free: true,
        standard: true,
      },
      {
        name: "Test Failure",
        description:
          "If GitAuto-generated tests fail in a pull request, GitAuto automatically fixes them",
        free: "1 retry per PR",
        standard: "Unlimited retries until fixed",
      },
      {
        name: "Review Comment",
        description: "Trigger GitAuto by adding a review comment to a pull request",
        free: true,
        standard: true,
      },
      {
        name: "Schedule",
        description:
          "Add tests on a set schedule for the file with the lowest coverage and the fewest lines. Executions per day and start time vary.",
        free: "1x/day at 9:00 (fixed)",
        standard: "Up to 12x/day, any time",
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
        standard: true,
      },
    ],
  },
];
