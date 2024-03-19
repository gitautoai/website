"use client";
import Image from "next/image";
import Link from "next/link";

import { useEffect } from "react";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

export default function Navbar() {
  const personTypeButtonStyles = `bg-blue text-white rounded-lg transition-colors 
  duration-200 sm:text-md xl:text-lg py-2 px-3 shadow-lg hover:shadow-lg 
  cursor-pointer hover:bg-blueHover font-semibold text-center md:w-auto`;
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
    <div className="flex flex-col w-full justify-center font-helvetica font-normal items-center bg-white text-black">
      <div className="flex flex-col w-[95vw]  sm:w-[80vw] 2xl:w-[1280px] ">
        <nav className="flex text-lg justify-center items-center my-4">
          <Link href="/" className="mr-auto ml-5">
            <div className="flex items-center gap-2 text-sm sm:text-xl text-black">
              <Image
                src="/transparent-not-centered.png"
                width={30}
                height={30}
                alt="GitAuto Logo"
              />
              <span className="font-bold font-lexend text-black">GitAuto</span>
            </div>
          </Link>
          <ol className="flex items-center justify-center gap-4">
            <li>
              <Link
                href="/#pricing"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
              >
                FAQ
              </Link>
            </li>
            <li>
              <Link
                href="https://github.com/apps/gitauto-ai"
                passHref
                target="_blank"
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "github_app_install_nav",
                    $current_url: window.location.href,
                  });
                }}
                className={`${personTypeButtonStyles}`}
              >
                Get Started
              </Link>
            </li>
            {/* <li>
              <Link
                href="/pricing"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
              >
                Documentation
              </Link>
            </li> */}
          </ol>
          {/* <WebNav></WebNav> */}

          {/* <MobileNav session={session} status={status}></MobileNav> */}
        </nav>
      </div>
      <hr className="h-[1px] opacity-50 bg-[#C2C2C2] w-full border-0 rounded"></hr>
    </div>
  );
}
