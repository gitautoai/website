export const PLAN_LIMITS = {
  FREE: {
    maxChars: 2000,
    maxUrls: 1,
    maxPaths: 1,
    canUseScreenshots: false,
  },
  STANDARD: {
    maxChars: 5000,
    maxUrls: 3,
    maxPaths: 5,
    canUseScreenshots: true,
  },
  PREMIUM: {
    maxChars: 20000,
    maxUrls: 10,
    maxPaths: 20,
    canUseScreenshots: true,
  },
} as const;

export type PlanType = keyof typeof PLAN_LIMITS;
