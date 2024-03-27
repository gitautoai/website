import Link from "next/link";

// Styling
import { Drawer, DrawerContent, DrawerBody, Text } from "@chakra-ui/react";
import { motion } from "framer-motion";

import { signIn } from "next-auth/react";

interface MobileDrawerProps {
  setIsNavOpen: (prev: boolean) => void;
  isNavOpen: boolean;
  posthog: any;
}

const buttonStyles = `bg-pink text-white rounded-lg transition-colors 
duration-200 sm:text-md xl:text-lg py-2 px-3 shadow-lg hover:shadow-lg 
cursor-pointer hover:bg-pinkHover font-semibold text-center md:w-auto `;

export default function MobileDrawer({
  setIsNavOpen,
  isNavOpen,
  posthog,
}: MobileDrawerProps) {
  return (
    <Drawer
      isOpen={isNavOpen}
      size="full"
      onClose={() => setIsNavOpen(!isNavOpen)}
    >
      <DrawerContent className="text-3xl bg-white">
        <DrawerBody p={0}>
          <ol className="flex flex-col items-center justify-center gap-20 mt-36">
            <li>
              <Link
                href="/#use-cases"
                passHref
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link outline-none"
              >
                Use Cases
              </Link>
            </li>
            <li>
              <Link
                href="/#pricing"
                passHref
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link"
              >
                Pricing
              </Link>
            </li>
            <li>
              <Link
                href="/#faq"
                passHref
                onClick={() => {
                  setIsNavOpen(false);
                }}
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link"
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
                  });
                  setIsNavOpen(false);
                }}
                className={`${buttonStyles}`}
              >
                Get Started
              </Link>
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
                    callbackUrl: `/dashboard`,
                  });
                }}
                className="bg-pink text-white rounded-lg transition-colors duration-200 text-xl
         py-1 px-3 whitespace-nowrap shadow-md hover:shadow-lg cursor-pointer hover:bg-blueHover mr-5"
              >
                Sign In
              </motion.button>
            </li>
            <li></li>
          </ol>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
