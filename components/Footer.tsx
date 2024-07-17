"use client";

// Third party imports
import Link from "next/link";
import { usePostHog } from "posthog-js/react";

// Local imports
import { useAccountContext } from "@/components/Context/Account";
import SNS from "./Button/SNS";
import { INTERNAL_LINKS } from "@/app/config/internal-links";

export default function Footer() {
  // Analytics
  const posthog = usePostHog();
  const { userInfosSubscribed, selectedIndex } = useAccountContext();
  return (
    <div
      id="footer"
      className="flex flex-col w-full justify-center font-helvetica items-center bg-stone-200 shadow-lg pb-4"
    >
      <div className="flex w-full flex-col justify-center ">
        <div className="flex flex-col gap-10 sm:gap-0 sm:flex-row items-center py-10 mt-auto w-full text-black text-lg font-helvetica justify-center ">
          <div className="flex gap-20 xl:gap-36 w-auto mx-5">
            <ol className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:gap-5 items-center justify-center">
              {INTERNAL_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => {
                      posthog.capture("$click", {
                        $event_type: link.eventType,
                        $current_url: window.location.href,
                      });
                    }}
                    className="whitespace-nowrap hover:underline"
                  >
                    {link.text}
                  </Link>
                </li>
              ))}
              {/* If there is an active subscription, show "Manage Payment" */}
              {selectedIndex != null &&
                userInfosSubscribed &&
                userInfosSubscribed[selectedIndex] === true && (
                  <li key={"manage_payment"}>
                    <Link
                      href="/?subscribe"
                      onClick={() => {
                        posthog.capture("$click", {
                          $event_type: "manage_payment",
                          $current_url: window.location.href,
                        });
                      }}
                      className="whitespace-nowrap hover:underline"
                    >
                      Manage Payment
                    </Link>
                  </li>
                )}
            </ol>
          </div>
        </div>
        <div className="mx-auto flex flex-col items-center gap-5">
          <SNS />
          <span>&copy; {new Date().getFullYear()} GitAuto, Inc. All Rights Reserved</span>
        </div>
      </div>
    </div>
  );
}
