"use client";
import config from "@/config";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";

// import {
//   NEXT_PUBLIC_POSTHOG_KEY,
//   NEXT_PUBLIC_POSTHOG_HOST,
// } from "@/lib/constants";

if (typeof window !== "undefined") {
  posthog.init(config.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: config.NEXT_PUBLIC_POSTHOG_HOST as string,
    capture_pageview: false, // Disable automatic pageview capture, as we capture manually
  });
}

export function PHProvider({ children }: any) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
