import { StructuredRules } from "./rules/config/structured-rules";

export type BaseSettings = {
  firstName: string;
  lastName: string;
  email: string;
  githubUserId: string;
  githubUserName: string;
  githubUserEmail: string;
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

export type TriggerSettings = {
  triggerOnReviewComment: boolean;
  triggerOnTestFailure: boolean;
  triggerOnSchedule: boolean;
  scheduleTimeLocal: string; // Format: "HH:MM" (24-hour format)
  scheduleTimeUTC: string; // Format: "HH:MM" (24-hour format)
  scheduleIncludeWeekends: boolean;
  scheduleExecutionCount: number;
  scheduleIntervalMinutes: number;
};

export type Settings = RulesSettings | ReferenceSettings | TriggerSettings;
