"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// Components
import HamburgerMenu from "./hamburgerMenu";
import MobileDrawer from "./MobileMenu";
import AuthControls from "@/components/AuthControls";

// Analytics
import { usePostHog } from "posthog-js/react";

// Third Party
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";

import { motion } from "framer-motion";
import ProfileIcon from "./ProfileIcon";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/index";
import { INTERNAL_LINKS } from "@/config/internal-links";

const buttonStyles = `bg-pink-600 text-white rounded-lg transition-colors 
duration-200 py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pink-700 text-center md:w-auto `;

export default function Navbar() {
  // Analytics
  const pathname = usePathname();
  const posthog = usePostHog();
  const isSettingsPage = pathname?.startsWith("/settings");

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

  if (isSettingsPage) return null;
  return (
    <div className="absolute top-0 left-0 flex flex-col w-full justify-center items-center font-helvetica sm:text-md xl:text-lg bg-white px-0 md:px-24">
      <div className="flex flex-col w-full">
        <nav className="flex text-lg justify-center items-center">
          <Link href={RELATIVE_URLS.INDEX} className="mr-auto ml-5">
            <Image src="/og-logo.png" width={150} height={78} loading="lazy" alt="GitAuto Logo" />
          </Link>
          <ol className="hidden md:flex items-center justify-center gap-5">
            {INTERNAL_LINKS.slice(1, -2).map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="whitespace-nowrap transition duration-[325ms] link"
                >
                  {link.text}
                </Link>
              </li>
            ))}
            <AuthControls />
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
