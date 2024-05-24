"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Components
import Footer from "@/components/Footer";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";
import { config } from "@/config";

export default function Home() {
  const router = useRouter();

  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();

  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, posthog]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push(config.NEXT_PUBLIC_GITHUB_APP_URL as string);
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearTimeout(timeout);
    };
  }, [router]);

  return (
    <div className="bg-light text-black ">
      <div className="min-h-[calc(100vh-239px)] mx-5 text-center">
        <div className="flex flex-col justify-center items-center text-xl sm:text-2xl gap-10 ">
          <span className="mt-16">You have not installed our GitHub Marketplace App.</span>
          <span>Please wait while we redirect you to the installation page...</span>
          <span>You will be redirected in {timeLeft} seconds</span>
        </div>
      </div>
      <Footer />
    </div>
  );
}
