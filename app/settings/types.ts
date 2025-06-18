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
  triggerOnMerged: boolean;
  triggerOnSchedule: boolean;
  scheduleTime: string; // Format: "HH:MM" (24-hour format)
  scheduleIncludeWeekends: boolean;
};

export type Settings = RulesSettings | ReferenceSettings | ScreenshotSettings | TriggerSettings;
