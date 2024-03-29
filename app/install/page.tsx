"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import Footer from "@/components/Footer";
import LoadingSpinner from "@/components/Auth/LoadingSpinner";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export default function Home() {
  const router = useRouter();

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

  router.push("https://github.com/apps/gitauto-ai");

  return (
    <>
      <LoadingSpinner />
      <Footer />
    </>
  );
}
