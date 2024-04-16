"use client";
import React from "react";

import { useEffect } from "react";
import Head from "next/head";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export default function PrivacyPolicy() {
  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, posthog]);
  return (
    <div className="h-[100svh]">
      <Head>
        <title>Privacy Policy</title>
      </Head>
      <iframe src="/privacy-policy.pdf" width="100%" height="100%"></iframe>
    </div>
  );
}
