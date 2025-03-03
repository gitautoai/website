export type BaseSettingsType = {
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

export type RulesSettingsType = {
  orgRules: string;
  repoRules: string;
  userRules: string;
};

export type ReferenceSettingsType = {
  webUrls: string[];
  filePaths: string[];
};

export type ScreenshotSettingsType = {
  useScreenshots: boolean;
  productionUrl: string;
  localPort: string;
  startupCommands: string;
};

export type AllSettingsType = BaseSettingsType &
  RulesSettingsType &
  ReferenceSettingsType &
  ScreenshotSettingsType;
