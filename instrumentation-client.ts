// This file configures the initialization of Sentry on the client.
// The config you add here will be used whenever a users loads a page in their browser.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";
import { config } from "./config";

// import { NODE_ENV } from "@/lib/constants";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN!,

  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: config.NODE_ENV === "production",

  replaysOnErrorSampleRate: 1.0,

  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,

  ignoreErrors: [
    // Error when Outlook scans our link: https://gitauto.ai, usually from a specific IP address like 40.94.33.28.
    // https://github.com/getsentry/sentry-javascript/issues/3440
    // https://docs.sentry.io/platforms/javascript/configuration/filtering/#using-
    /Non-Error promise rejection captured with value: (undefined|Object Not Found Matching Id:\d+, MethodName:\w+, ParamCount:\d+)/,
    // Browser extension errors (TronLink, MetaMask, etc.)
    /tronlinkParams/,
  ],

  denyUrls: [
    // Browser extensions inject scripts that can throw errors we can't control
    /injected\.js/,
    /chrome-extension:\/\//,
    /moz-extension:\/\//,
    /safari-extension:\/\//,
  ],

  // You can remove this option if you're not planning to use the Sentry Session Replay feature:
  integrations: [
    Sentry.replayIntegration({
      // Additional Replay configuration goes in here, for example:
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
