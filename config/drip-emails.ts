/** Days since install before sending the first onboarding email */
export const FIRST_EMAIL_DAY = 1;

/** Days between consecutive onboarding email slots */
export const EMAIL_GAP_DAYS = 2;

/** Max emails sent per cron run across all users (randomized to look natural) */
export const DAILY_SEND_LIMIT = Math.floor(Math.random() * 18) + 8;

/** Days of inactivity (no PRs) before a user is considered dormant */
export const DORMANCY_THRESHOLD_DAYS = 7;

/** Override recipient for dry-run testing. Set to "" to send to real users. TODO: Remove after dry run */
export const DRY_RUN_TO = "hnishio0105@gmail.com";
