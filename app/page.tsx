"use client";
import React, { useEffect } from "react";

// Components
import FAQ from "@/components/HomePage/FAQ";
import HowItWorks from "@/components/HomePage/HowItWorks";
import HowToGetStarted from "@/components/HomePage/HowToGetStarted";
import Pricing from "@/components/HomePage/Pricing";
import UseCases from "@/components/HomePage/UseCases";
import ValueProp from "@/components/HomePage/ValueProp";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
export default function Home() {
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
    <div className="flex flex-col justify-center items-center px-5 md:px-24">
      <ValueProp />
      <HowItWorks />
      <UseCases />
      <HowToGetStarted />
      <Pricing />
      <FAQ />
    </div>
  );
}
