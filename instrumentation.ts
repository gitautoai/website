import * as Sentry from "@sentry/nextjs";
import { config } from "./config";

/**
 * Initialize Sentry for server-side and edge features.
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,
    enabled: config.NODE_ENV === "production",

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
