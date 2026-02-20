"use client";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { isPrd } from "@/config";
import { NEXT_PUBLIC_POSTHOG_KEY, NEXT_PUBLIC_POSTHOG_HOST } from "@/config/posthog";

if (typeof window !== "undefined" && isPrd && NEXT_PUBLIC_POSTHOG_KEY && NEXT_PUBLIC_POSTHOG_HOST) {
  posthog.init(NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: NEXT_PUBLIC_POSTHOG_HOST,
    capture_pageview: true,
  });
}

export function PostHogWrapper({ children }: { children: React.ReactNode }) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
