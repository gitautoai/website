"use client";
// Third party imports
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { useEffect } from "react";

// Local components
import FAQ from "@/app/components/home/FAQ";
import Hero from "@/app/components/home/Hero";
import HowItWorks from "@/app/components/home/HowItWorks";
import HowToGetStarted from "@/app/components/home/HowToGetStarted";
import Pricing from "@/app/components/home/Pricing";
import UseCases from "@/app/components/home/UseCases";
import WhatGitAutoDoes from "@/app/components/home/WhatGitAutoDoes";
import WhyGitAuto from "@/app/components/home/WhyGitAuto";
import ScrollNav from "@/app/components/navigations/ScrollNav";
import { softwareApplicationData } from "@/app/jsonld";

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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationData) }}
      />
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
    </>
  );
}
