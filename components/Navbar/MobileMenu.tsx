import { Drawer, DrawerContent, DrawerBody, Text } from "@chakra-ui/react";

import Link from "next/link";

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
      <DrawerContent
        className="text-3xl bg-white"
        onClick={() => {
          setIsNavOpen(false);
        }}
      >
        <DrawerBody p={0}>
          <ol className="flex flex-col items-center justify-center gap-20 mt-36">
            <li>
              <Link
                href="/#use-cases"
                passHref
                className="whitespace-nowrap transition duration-[325ms]  hover:text-blue link outline-none"
              >
                UseCases
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
            <li>
              <Link
                href="https://github.com/apps/gitauto-ai"
                passHref
                target="_blank"
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "github_app_install_nav",
                  });
                }}
                className={`${buttonStyles}`}
              >
                Get Started
              </Link>
            </li>
          </ol>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}