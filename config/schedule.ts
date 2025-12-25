export const MAX_EXECUTIONS = 12;
export const ALLOWED_INTERVALS = [5, 10, 15, 20, 30, 60];
export const DEFAULT_EXECUTION_COUNT = 3;
export const DEFAULT_INTERVAL_MINUTES = 15;
export const DEFAULT_START_TIME = "09:00";

export const DEFAULT_SCHEDULE_CONFIG = {
  time: DEFAULT_START_TIME,
  executions: DEFAULT_EXECUTION_COUNT,
  interval: DEFAULT_INTERVAL_MINUTES,
  weekends: false,
};
