"use client";
import React, { useEffect } from "react";

// NextJs imports
import Image from "next/image";
import Link from "next/link";

// Components
import Footer from "@/components/Footer";
import Pricing from "@/components/HomePage/Pricing";
import HowToGetStarted from "@/components/HomePage/HowToGetStarted";
import UseCases from "@/components/HomePage/UseCases";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import config from "@/config";
export default function Home() {
  const buttonStyles = `bg-pink text-white rounded-lg transition-colors 
  duration-200 text-md sm:text-lg xl:text-xl py-5 px-8 shadow-lg hover:shadow-lg 
  cursor-pointer hover:bg-pinkHover font-semibold text-center md:w-auto`;

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
    <div className="h-[calc(100vh-73px)] bg-light text-black ">
      <div className="flex flex-col justify-center items-center bg-light">
        <div className="w-[98vw] md:w-[95vw] lg:w-[90vw] xl:w-[80vw] 2xl:w-[1280px] ">
          <div className="flex flex-col md:flex-row items-center justify-evenly gap-8 md:gap-6 lg:gap-8 xl:gap-10 mx-5">
            <div className="flex flex-col items-center gap-4 fourteenHundred:gap-6 text-center">
              <h1 className="text-center text-3xl sm:text-5xl fourteenHundred:text-7xl font-helvetica font-semibold mt-16 sm:space-y-3">
                <div>
                  AI software engineer that&nbsp;
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink to-[#FCA831]">
                    writes code,
                  </span>
                </div>
                <div>enabling more bug fixes and feature requests</div>
              </h1>
              <a
                href={config.NEXT_PUBLIC_GITHUB_APP_URL}
                target="_blank"
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "github_app_install",
                    $current_url: window.location.href,
                  });
                }}
                className={`${buttonStyles} mx-auto mt-8 flex items-center gap-2`}
              >
                <Image
                  src="/icons/github.svg"
                  width={30}
                  height={30}
                  alt="Github Logo"
                  className="invert"
                />
                Get Started for Free
              </a>
            </div>
          </div>
        </div>
        <div className="mt-14 mb-16">
          <iframe
            className="lg:h-[540px] lg:w-[960px] md:h-[396px] md:w-[704px] sm:h-[333px] sm:w-[592px] w-[90vw] aspect-video"
            src={`https://www.youtube.com/embed/gulhHrKCPxQ?autoplay=1&mute=1&loop=1&playlist=gulhHrKCPxQ&rel=0`}
            allow="accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture"
          ></iframe>
        </div>

        <UseCases />

        <HowToGetStarted />

        <Pricing />

        <div className="bg-white text-black w-[100vw] flex flex-col items-center py-16 px-5">
          <h2
            className="text-center text-3xl font-helvetica font-medium"
            id="faq"
          >
            FAQ
          </h2>
          <div className=" flex flex-col gap-5 mt-5">
            <div className="flex flex-col ">
              <span className="font-bold text-lg">Do we retain your data?</span>
              <span className="text-md">
                No, we don&apos;t retain your data. We read but we don&apos;t
                clone your repo or save your data.
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold text-lg">
                What languages do we support?
              </span>
              <span className="text-md">
                GitAuto supports virtually all languages.
              </span>
            </div>
            <div className="flex flex-col ">
              <span className="font-bold text-lg">
                Is there a repository limit?
              </span>
              <span className="text-md">There is not.</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
