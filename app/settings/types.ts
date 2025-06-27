import { StructuredRules } from "./rules/config/structured-rules";

export type BaseSettings = {
  firstName: string;
  lastName: string;
  email: string;
  githubUserId: string;
  githubUserName: string;
  githubUserEmail: string;
  jiraUserId: string;
  jiraUserName: string;
  jiraUserEmail: string;
};

export type RulesSettings = {
  repoRules: string;
  targetBranch: string;
  structuredRules: StructuredRules;
};

export type ReferenceSettings = {
  webUrls: string[];
  filePaths: string[];
};

export type ScreenshotSettings = {
  useScreenshots: boolean;
  productionUrl: string;
  localPort: number;
  startupCommands: string[];
};

export type TriggerSettings = {
  triggerOnReviewComment: boolean;
  triggerOnTestFailure: boolean;
  triggerOnCommit: boolean;
  triggerOnPrChange: boolean;
  triggerOnMerged: boolean;
  triggerOnSchedule: boolean;
  scheduleTimeLocal: string; // Format: "HH:MM" (24-hour format)
  scheduleTimeUTC: string; // Format: "HH:MM" (24-hour format)
  scheduleIncludeWeekends: boolean;
};

export type Settings = RulesSettings | ReferenceSettings | ScreenshotSettings | TriggerSettings;
