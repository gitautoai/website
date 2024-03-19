// Next imports
import Link from "next/link";
import Image from "next/image";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGithub,
  faXTwitter,
  faLinkedin,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
// Analytics
import { usePostHog } from "posthog-js/react";
import { faLink } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  // Analytics
  const posthog = usePostHog();

  const iconSize = "2x";

  return (
    <div className="flex flex-col w-full justify-center font-helvetica items-center bg-darkBlue shadow-lg pb-4">
      <div className="flex  w-[95vw]  sm:w-[80vw] 2xl:w-[1280px] flex-col justify-center ">
        <div className="flex flex-col gap-10 sm:gap-0 sm:flex-row items-center py-10 mt-auto w-full text-white text-lg font-helvetica justify-center ">
          <div className="flex flex-wrap  gap-16 xl:gap-32 mx-auto w-auto ">
            <ol className="flex gap-2">
              <li>
                <Link
                  href="https://github.com/apps/gitauto-ai"
                  passHref
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "github_app_install",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Github
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/pricing"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Discord
                </Link>
              </li> */}
              <li>
                <a
                  href="#pricing"
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "pricing",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Pricing
                </a>
              </li>
              <li>
                <Link
                  href="https://billing.stripe.com/p/login/eVacPB8qCbV64Ni144"
                  passHref
                  onClick={() => {
                    posthog.capture("$click", {
                      $event_type: "manage_payment",
                      $current_url: window.location.href,
                    });
                  }}
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Manage Payment
                </Link>
              </li>
              {/* <li>
                <Link
                  href="/docs"
                  passHref
                  className="whitespace-nowrap transition duration-[325ms]  hover:text-blue"
                >
                  Docs
                </Link>
              </li> */}
            </ol>
          </div>
        </div>
        <div className="mx-auto flex items-center gap-5">
          <span className=" text-white">
            &copy; 2024 GitAuto. All Rights Reserved
          </span>
          <Link
            href="https://github.com/apps/gitauto-ai"
            passHref
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
            href="https://twitter.com/git-auto"
            passHref
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
            passHref
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
            passHref
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
  );
}
