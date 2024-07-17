"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Components
import HamburgerMenu from "./hamburgerMenu";
import MobileDrawer from "./MobileMenu";

// Analytics
import { usePostHog } from "posthog-js/react";

// Third Party
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";
import ProfileIcon from "./ProfileIcon";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config";

const buttonStyles = `bg-pink-600 text-white rounded-lg transition-colors 
duration-200 py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pink-700 text-center md:w-auto `;

export default function Navbar() {
  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();

  const { data: session, status } = useSession();

  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    if (pathname && posthog) {
      let url = window.origin + pathname;
      posthog.capture("$pageview", {
        $current_url: url,
      });
    }
  }, [pathname, posthog]);

  return (
    <div className="absolute top-0 left-0 flex flex-col w-full justify-center items-center font-helvetica sm:text-md xl:text-lg bg-white px-0 md:px-24">
      <div className="flex flex-col w-full">
        <nav className="flex text-lg justify-center items-center">
          <Link href={RELATIVE_URLS.INDEX} className="mr-auto ml-5">
            <Image src="/og-logo.png" width={150} height={78} loading="lazy" alt="GitAuto Logo" />
          </Link>
          <ol className="hidden md:flex items-center justify-center gap-5">
            <li>
              <Link
                href={RELATIVE_URLS.HOW_IT_WORKS}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                How It Works
              </Link>
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.USE_CASES}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                Use Cases
              </Link>
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.HOW_TO_GET_STARTED}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                How to Get Started
              </Link>
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.PRICING}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href={RELATIVE_URLS.FAQ}
                className="whitespace-nowrap transition duration-[325ms] link"
              >
                FAQ
              </Link>
            </li>
            {status === "unauthenticated" && (
              <>
                <li>
                  <Link
                    href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
                    target="_blank"
                    onClick={() => {
                      posthog.capture("$click", {
                        $event_type: "github_app_install_nav",
                        $current_url: window.location.href,
                      });
                    }}
                    className={`${buttonStyles}`}
                  >
                    Get Started
                  </Link>
                </li>
                <li>
                  <motion.button
                    whileHover={{
                      scale: 1.04,
                      transition: { duration: 0.1 },
                    }}
                    whileTap={{
                      scale: 0.98,
                      transition: { duration: 0.1 },
                    }}
                    onClick={() => {
                      signIn("github", {
                        callbackUrl: `/`,
                      });
                    }}
                    className="border border-pink-600 text-black rounded-lg transition-colors duration-200 py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer mr-5"
                  >
                    Sign In
                  </motion.button>
                </li>
              </>
            )}
            {status === "authenticated" && <ProfileIcon session={session} />}
          </ol>
          <HamburgerMenu
            setIsNavOpen={setIsNavOpen}
            isNavOpen={isNavOpen}
            session={session}
            status={status}
          />
          <MobileDrawer setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} posthog={posthog} />
        </nav>
      </div>
    </div>
  );
}
