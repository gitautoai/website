"use client";

// Local components
import FAQ from "@/app/components/home/FAQ";
import Hero from "@/app/components/home/Hero";
import Demo from "@/app/components/home/Demo";
import HowItWorks from "@/app/components/home/HowItWorks";
import HowToGetStarted from "@/app/components/home/HowToGetStarted";
import Pricing from "@/app/components/home/Pricing";
import UseCases from "@/app/components/home/UseCases";
import WhatGitAutoDoes from "@/app/components/home/WhatGitAutoDoes";
import WhyGitAuto from "@/app/components/home/WhyGitAuto";
import ScrollNav from "@/app/components/navigations/ScrollNav";
import { softwareApplicationData } from "@/app/jsonld";

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationData) }}
      />
      <div className="flex flex-col justify-center items-center px-0 md:px-24">
        <ScrollNav />
        <Hero />
        <Demo />
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
