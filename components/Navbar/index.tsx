"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Components
import HamburgerMenu from "./hamburgerMenu";
import MobileDrawer from "./MobileMenu";

// Analytics
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

// Third Party
import { signIn, signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";
import ProfileIcon from "./ProfileIcon";

const buttonStyles = `bg-pink text-white rounded-lg transition-colors 
duration-200 py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pinkHover text-center md:w-auto `;

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
    <div className="flex flex-col w-full justify-center items-center font-helvetica font-normal  bg-white text-black sm:text-md xl:text-lg">
      <div className="flex flex-col w-[95vw] sm:w-[80vw] 2xl:w-[1280px]">
        <nav className="flex text-lg justify-center items-center my-4">
          <Link href="/" className="mr-auto ml-5">
            <div className="flex items-center gap-2 text-black">
              <Image
                src="/transparent-not-centered.png"
                width={30}
                height={30}
                alt="GitAuto Logo"
              />
              {/* <Image
                src="/og-logo.png"
                width={120}
                height={63}
                alt="GitAuto Logo"
              />
  */}
              <span className="font-bold font-lexend text-black">GitAuto</span>
            </div>
          </Link>
          <ol className="hidden sm:flex items-center justify-center gap-4">
            <li>
              <Link
                href="/#use-cases"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link"
              >
                Use Cases
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link"
              >
                FAQ
              </Link>
            </li>
            {status === "unauthenticated" && (
              <>
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
                    className="bg-white border border-pink text-black rounded-lg transition-colors duration-200
         py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer hover:bg-blueHover mr-5"
                  >
                    Sign In
                  </motion.button>
                </li>
              </>
            )}
            {status === "authenticated" && <ProfileIcon session={session} />}
          </ol>
          <HamburgerMenu setIsNavOpen={setIsNavOpen} isNavOpen={isNavOpen} />
          <MobileDrawer
            setIsNavOpen={setIsNavOpen}
            isNavOpen={isNavOpen}
            posthog={posthog}
          />
        </nav>
      </div>
      <hr className="h-[1px] opacity-50 bg-[#C2C2C2] w-full border-0 rounded"></hr>
    </div>
  );
}
