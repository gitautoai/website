import * as Sentry from "@sentry/nextjs";
import { config } from "./config";

/**
 * Initialize Sentry for server-side and edge features.
 * @see https://docs.sentry.io/platforms/javascript/guides/nextjs/
 */
export function register() {
  Sentry.init({
    dsn: "https://edc3c897ec77dbdf06de9dd08f70513b@o4506827828101120.ingest.us.sentry.io/4506827829346304",

    // Adjust this value in production, or use tracesSampler for greater control
    tracesSampleRate: 1,
    enabled: config.NODE_ENV === "production",

    // Setting this option to true will print useful information to the console while you're setting up Sentry.
    debug: false,
  });
}
