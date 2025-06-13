import { ANTHROPIC_MODEL_CLAUDE_40 } from "./anthropic";
import { GOOGLE_GEMINI } from "./google";
import { OPENAI_MODEL_O4_MINI } from "./openai";

export const PRS = {
  MONTHLY: {
    FREE: 3,
    STANDARD: 20,
    ENTERPRISE: "200+",
  },
  YEARLY: {
    STANDARD: 240,
    ENTERPRISE: "2400+",
  },
};

export const FREE_FEATURES = [
  ANTHROPIC_MODEL_CLAUDE_40,
  `${PRS.MONTHLY.FREE} PRs per month per GitHub organization`,
  "Unlimited repositories",
  "Unlimited users",
  "Dashboard trigger",
  "Issue checkbox trigger",
  "Issue label trigger",
  "Coverage report import",
  "Custom base branch",
  "Repository rules",
  "Reference URLs/files",
];

export const STANDARD_FEATURES = [
  "Everything in Free plan",
  ANTHROPIC_MODEL_CLAUDE_40,
  `${PRS.MONTHLY.STANDARD} PRs per month per GitHub organization`,
  `Scale to more PRs by increasing quantity (${PRS.MONTHLY.STANDARD} PRs × quantity)`,
  "Test failure trigger",
  "Review comment trigger",
  "Commit trigger",
  "Merge trigger",
  "Schedule trigger",
];

export const ENTERPRISE_FEATURES = [
  "Everything in Standard plan",
  `${ANTHROPIC_MODEL_CLAUDE_40}, ${OPENAI_MODEL_O4_MINI}, ${GOOGLE_GEMINI}, and more`,
  `${PRS.MONTHLY.ENTERPRISE} PRs per month per GitHub organization`,
  "Self LLM API key",
  "Self hosting",
  "SAML / SSO",
  "Fine tuning with your data",
  "Dedicated Customer Support",
];

export const PRICE_FEATURES = [
  {
    name: "Price",
    description: "Choose the plan that fits your team's needs.",
    free: "$0",
    standard: "$100/month",
    enterprise: "$500+/month",
    standardYearly: "$1,000/year",
    enterpriseYearly: "$5,000+/year",
  },
];

export const TABLE_FEATURES = [
  {
    category: "Base Features",
    items: [
      {
        name: "AI Models",
        description: "AI models used for test generation",
        free: ANTHROPIC_MODEL_CLAUDE_40,
        standard: ANTHROPIC_MODEL_CLAUDE_40,
        enterprise: `${ANTHROPIC_MODEL_CLAUDE_40}, ${OPENAI_MODEL_O4_MINI}, ${GOOGLE_GEMINI}, and more`,
      },
      {
        name: "PRs per Month",
        description: "Number of pull requests per month per GitHub organization",
        free: `${PRS.MONTHLY.FREE}`,
        standard: `${PRS.MONTHLY.STANDARD} × quantity`,
        enterprise: `${PRS.MONTHLY.ENTERPRISE}`,
      },
      {
        name: "Repositories",
        description: "Number of repositories GitAuto can work with",
        free: "Unlimited",
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
        name: "Coverage Report Import",
        description: "Import code coverage reports from your GitHub Actions artifacts",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Repository Rules",
        description: "Configure repository specific rules for GitAuto",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Reference URLs",
        description: "Add URLs for GitAuto to understand your code",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Reference Files",
        description: "Add files for GitAuto to understand your code",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Custom Base Branch",
        description: "Choose which branch GitAuto uses as the base for new PRs",
        free: true,
        standard: true,
        enterprise: true,
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
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Review Comment",
        description: "Trigger GitAuto by adding a review comment to a pull request",
        free: true,
        standard: true,
        enterprise: true,
      },
      {
        name: "Commit",
        description: "Add missing tests after each commit on the same PR",
        free: false,
        standard: true,
        enterprise: true,
      },
      {
        name: "Merge",
        description: "Add missing tests after a PR is merged",
        free: false,
        standard: true,
        enterprise: true,
      },
      {
        name: "Schedule",
        description:
          "Add tests on a set schedule for the file with the lowest coverage and the fewest lines",
        free: false,
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
