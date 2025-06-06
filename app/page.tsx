"use client";
import React, { useEffect } from "react";

// Components
import FAQ from "@/app/components/HomePage/FAQ";
import Hero from "@/app/components/HomePage/Hero";
import HowItWorks from "@/app/components/HomePage/HowItWorks";
import HowToGetStarted from "@/app/components/HomePage/HowToGetStarted";
import Pricing from "@/app/components/HomePage/Pricing";
import UseCases from "@/app/components/HomePage/UseCases";
import WhyGitAuto from "@/app/components/HomePage/WhyGitAuto";

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
    <div className="flex flex-col justify-center items-center px-0 md:px-24">
      <Hero />
      <WhyGitAuto />
      <HowItWorks />
      <UseCases />
      <HowToGetStarted />
      <Pricing />
      <FAQ />
    </div>
  );
}
