// Test constants for GitAuto website tests

export const MOCK_OWNER = {
  id: 123,
  name: "test-org",
  type: "Organization",
};

export const MOCK_REPO = {
  id: 456,
  name: "test-repo",
  fullName: "test-org/test-repo",
};

export const MOCK_USER = {
  id: 789,
  name: "testuser",
  email: "testuser@example.com",
};

export const MOCK_TRIGGER_SETTINGS = {
  default: {
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnPrChange: false,
    triggerOnMerged: false,
    triggerOnSchedule: false,
    scheduleTime: "09:00",
    scheduleIncludeWeekends: false,
  },
  withSchedule: {
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnPrChange: false,
    triggerOnMerged: false,
    triggerOnSchedule: true,
    scheduleTime: "14:30",
    scheduleIncludeWeekends: true,
  },
};

export const MOCK_DATABASE_ERROR = new Error("Database connection failed");
export const MOCK_AWS_ERROR = new Error("AWS operation failed");