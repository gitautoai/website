"use client";

// Third party imports
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePostHog } from "posthog-js/react";

// Local imports
import SNS from "@/app/components/buttons/SNS";
import { INTERNAL_LINKS } from "@/config/internal-links";
import { ABSOLUTE_URLS, RELATIVE_URLS, SNS_LINKS } from "@/config/urls";

export default function Footer() {
  // Analytics
  const posthog = usePostHog();
  const pathname = usePathname();
  const hideFooter = pathname?.startsWith("/settings") || pathname?.startsWith("/dashboard");
  if (hideFooter) return null;

  const groupedLinks = INTERNAL_LINKS.reduce(
    (acc, link) => {
      if (!acc[link.category]) acc[link.category] = [] as (typeof INTERNAL_LINKS)[number][];
      acc[link.category].push(link);
      return acc;
    },
    {} as Record<string, (typeof INTERNAL_LINKS)[number][]>
  );

  const categoryTitles: Record<string, string> = {
    product: "Product",
    resources: "Resources",
    legal: "Legal",
    sns: "Connect With Us",
  };

  return (
    <footer className="bg-gray-100 border-t border-gray-200 pt-16 pb-8 mt-36">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CTA Section */}
        <div className="mb-16 bg-gradient-to-r from-pink-600 to-purple-700 rounded-2xl p-8 md:p-12 shadow-xl">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">
                Ready to improve your test coverage?
              </h3>
              <p className="text-white/80 mb-6">
                Go from 0% to 90% test coverage with GitAuto. Start for free, no credit card
                required.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-end">
              <Link
                href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
                target="_blank"
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "footer_install_button",
                    $current_url: window.location.href,
                  });
                }}
                className="px-8 py-3 bg-white text-pink-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors text-center"
              >
                Install Free
              </Link>
              <Link
                href={RELATIVE_URLS.CONTACT}
                onClick={() => {
                  posthog.capture("$click", {
                    $event_type: "footer_contact_button",
                    $current_url: window.location.href,
                  });
                }}
                className="px-8 py-3 bg-transparent border border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors text-center"
              >
                Contact Sales
              </Link>
            </div>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-16 mb-12">
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

        {/* Bottom Section */}
        <div className="border-t border-gray-200 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center">
              <Image src="/logo.png" alt="GitAuto Logo" width={120} height={30} />
              <span className="ml-4 text-gray-600">
                &copy; {new Date().getFullYear()} GitAuto, Inc. All Rights Reserved
              </span>
            </div>

            <SNS />
          </div>
        </div>
      </div>
    </footer>
  );
}
