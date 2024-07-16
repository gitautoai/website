"use client";
// Next imports
import Link from "next/link";

// Components
import { useAccountContext } from "@/components/Context/Account";

import { usePostHog } from "posthog-js/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faXTwitter, faLinkedin, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { config, RELATIVE_URLS } from "@/config";

export default function Footer() {
  // Analytics
  const posthog = usePostHog();
  const { userInfosSubscribed, selectedIndex, userInfos } = useAccountContext();

  const iconSize = "2x";

  return (
    <div
      id="footer"
      className="flex flex-col w-full justify-center font-helvetica items-center bg-stone-200 shadow-lg pb-4"
    >
      <div className="flex w-full flex-col justify-center ">
        <div className="flex flex-col gap-10 sm:gap-0 sm:flex-row items-center py-10 mt-auto w-full text-black text-lg font-helvetica justify-center ">
          <div className="flex gap-20 xl:gap-36 w-auto mx-5">
            <ol className="flex flex-wrap gap-5 items-center justify-center">
              <li>
                <Link
                  href={config.NEXT_PUBLIC_GITHUB_APP_URL as string}
                  target="_blank"
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "github_app_install",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]"
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  href={RELATIVE_URLS.PRICING}
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "pricing",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  href={RELATIVE_URLS.PRIVACY_POLICY}
                  target="_blank"
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "privacy_policy",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href={RELATIVE_URLS.TERMS_OF_SERVICE}
                  target="_blank"
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "terms_of_service",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]"
                >
                  Terms of Service
                </Link>
              </li>
              {/* If there is an active subscription, show "Manage Payment" */}
              {selectedIndex != null &&
                userInfosSubscribed &&
                userInfosSubscribed[selectedIndex] === true && (
                  <li>
                    <Link
                      href="/?subscribe"
                      onClick={() => {
                        posthog.capture("$click", {
                          $event_type: "manage_payment",
                          $current_url: window.location.href,
                        });
                      }}
                      className="whitespace-nowrap transition duration-[325ms]"
                    >
                      Manage Payment
                    </Link>
                  </li>
                )}
            </ol>
          </div>
        </div>
        <div className="mx-auto flex flex-col-reverse sm:flex-row items-center gap-5">
          <span className=" text-black">&copy; 2024 GitAuto. All Rights Reserved</span>
          <div className="flex items-center gap-5">
            <Link
              href={config.NEXT_PUBLIC_GITHUB_APP_URL as string}
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "github_app_install_footer",
                  $current_url: window.location.href,
                });
              }}
            >
              <FontAwesomeIcon icon={faGithub} size={iconSize} />
            </Link>
            <Link
              href="https://twitter.com/gitautoai"
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "x_footer",
                  $current_url: window.location.href,
                });
              }}
            >
              <FontAwesomeIcon icon={faXTwitter} size={iconSize} />
            </Link>
            <Link
              href="https://www.youtube.com/@gitauto"
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "youtube_footer",
                  $current_url: window.location.href,
                });
              }}
            >
              <FontAwesomeIcon icon={faYoutube} size={iconSize} />
            </Link>
            <Link
              href="https://www.linkedin.com/company/gitauto"
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "linked_in_footer",
                  $current_url: window.location.href,
                });
              }}
            >
              <FontAwesomeIcon icon={faLinkedin} size={iconSize} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
