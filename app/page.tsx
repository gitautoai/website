"use client";
// Third party imports
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// Local components
import FAQ from "@/app/components/HomePage/FAQ";
import Hero from "@/app/components/HomePage/Hero";
import HowItWorks from "@/app/components/HomePage/HowItWorks";
import HowToGetStarted from "@/app/components/HomePage/HowToGetStarted";
import Pricing from "@/app/components/HomePage/Pricing";
import UseCases from "@/app/components/HomePage/UseCases";
import WhatGitAutoDoes from "@/app/components/HomePage/WhatGitAutoDoes";
import WhyGitAuto from "@/app/components/HomePage/WhyGitAuto";
import ScrollNav from "@/app/components/Navigation/ScrollNav";

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
      <ScrollNav />
      <Hero />
      <WhyGitAuto />
      <WhatGitAutoDoes />
      <HowItWorks />
      <UseCases />
      <HowToGetStarted />
      <Pricing />
      <FAQ />
    </div>
  );
}
