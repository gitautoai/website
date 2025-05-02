"use client";

// Third party imports
import Link from "next/link";
import { usePostHog } from "posthog-js/react";
import { usePathname } from "next/navigation";

// Local imports
import { useAccountContext } from "@/components/Context/Account";
import { SNS_LINKS } from "@/config";
import { INTERNAL_LINKS } from "@/config/internal-links";
import SNS from "./Button/SNS";

export default function Footer() {
  // Analytics
  const posthog = usePostHog();
  const { installationsSubscribed, selectedIndex } = useAccountContext();
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/settings") || pathname?.startsWith("/dashboard");
  if (hideFooter) return null;

  const groupedLinks = INTERNAL_LINKS.reduce((acc, link) => {
    if (!acc[link.category]) acc[link.category] = [] as (typeof INTERNAL_LINKS)[number][];
    acc[link.category].push(link);
    return acc;
  }, {} as Record<string, (typeof INTERNAL_LINKS)[number][]>);

  const categoryTitles: Record<string, string> = {
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    sns: "Connect With Us",
  };

  return (
    <div
      id="footer"
      className="flex flex-col w-full justify-center items-center bg-stone-200 shadow-lg pb-4 mt-20"
    >
      <div className="flex w-full flex-col justify-center items-center">
        <div className="flex flex-col gap-10 sm:gap-8 py-10 mt-auto w-full justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-5xl mx-auto px-6">
            {/* Product Links with conditional Manage Subscriptions */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h3 className="font-bold text-gray-900">{categoryTitles.product}</h3>
              <ul className="flex flex-col gap-3">
                {groupedLinks.product.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        posthog.capture("$click", {
                          $event_type: link.eventType,
                          $current_url: window.location.href,
                        });
                      }}
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
                {selectedIndex != null &&
                  installationsSubscribed &&
                  installationsSubscribed[selectedIndex] === true && (
                    <li>
                      <Link
                        href="/?subscribe"
                        onClick={() => {
                          posthog.capture("$click", {
                            $event_type: "manage_payment",
                            $current_url: window.location.href,
                          });
                        }}
                        className="text-gray-600 hover:text-gray-900 hover:underline"
                      >
                        Manage Subscriptions
                      </Link>
                    </li>
                  )}
              </ul>
            </div>

            {/* Resources Links */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h3 className="font-bold text-gray-900">{categoryTitles.resources}</h3>
              <ul className="flex flex-col gap-3">
                {groupedLinks.resources.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        posthog.capture("$click", {
                          $event_type: link.eventType,
                          $current_url: window.location.href,
                        });
                      }}
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h3 className="font-bold text-gray-900">{categoryTitles.legal}</h3>
              <ul className="flex flex-col gap-3">
                {groupedLinks.legal.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => {
                        posthog.capture("$click", {
                          $event_type: link.eventType,
                          $current_url: window.location.href,
                        });
                      }}
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {link.text}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SNS Links */}
            <div className="flex flex-col gap-4 text-center sm:text-left">
              <h3 className="font-bold text-gray-900">{categoryTitles.sns}</h3>
              <ul className="flex flex-col gap-3">
                {Object.entries(SNS_LINKS).map(([key, value]) => (
                  <li key={key}>
                    <Link
                      href={value}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-gray-900 hover:underline"
                    >
                      {key}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="mx-auto flex flex-col items-center gap-5 max-w-5xl w-full px-6">
          <SNS />
          <span className="text-center">
            &copy; {new Date().getFullYear()} GitAuto, Inc. All Rights Reserved
          </span>
        </div>
      </div>
    </div>
  );
}
