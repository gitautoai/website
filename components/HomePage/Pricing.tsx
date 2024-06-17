"use client";
// Next imports
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";
// Analytics
import { usePostHog } from "posthog-js/react";

// Components
import { useAccountContext } from "@/components/Context/Account";

// Third Party
import { signIn } from "next-auth/react";

import { Spinner } from "@chakra-ui/react";
import {
  FREE_TIER_REQUEST_LIMIT,
  OPENAI_FREE_FILES,
  OPENAI_FREE_LINES,
  OPENAI_FREE_TOKENS,
  OPENAI_MAX_FILES,
  OPENAI_MAX_LINES,
  OPENAI_MAX_TOKENS,
  OPENAI_MODEL_NAME,
  config,
} from "@/config";

const pricingButtonStyles = `my-8 rounded-lg transition-colors  duration-200 
text-md sm:text-lg xl:text-xl py-3 w-[250px] sm:w-[315px] lg:w-[210px] shadow-lg hover:shadow-lg 
cursor-pointer font-semibold text-center mx-auto `;

export default function Pricing() {
  // Analytics
  const posthog = usePostHog();

  const { userId, jwtToken, email, selectedIndex, userInfos, userInfosSubscribed } =
    useAccountContext();

  const router = useRouter();

  const [isSubscribeLoading, setIsSubscribeLoading] = useState(false);
  const searchParams = useSearchParams();
  const [billingPeriod, setBillingPeriod] = useState<string>("Yearly");

  const createPortalOrCheckoutURL = useCallback(async () => {
    let currentIndex = 0;
    if (selectedIndex) {
      currentIndex = selectedIndex;
    }
    // If user has an installation, create portal or checkout session
    if (userInfos && userInfos.length > 0) {
      const response = await fetch("/api/stripe/create-portal-or-checkout-url", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
          customerId: userInfos[currentIndex].installations.owners.stripe_customer_id,
            name="pricing-option"
          email: email,
          ownerType: userInfos[currentIndex].installations.owner_type,
          ownerId: Number(userInfos[currentIndex].installations.owner_id.replace("n", "")),
          ownerName: userInfos[currentIndex].installations.owner_name,
          userName: userInfos[currentIndex].users.user_name,
          billingPeriod: billingPeriod,
        }),
      });

      const res = await response.json();
      createPortalOrCheckoutURL();
      router.push(res);
    } else {
      // If not, redirect to installation page
      router.push(config.REDIRECT_GITHUB_APP_URL);
    }
  }, [email, jwtToken, router, selectedIndex, userId, userInfos, billingPeriod]);

  // Flow: https://docs.google.com/spreadsheets/d/1AK7VPo_68mL2s3lvsKLy3Rox-QvsT5cngiWf2k0r3Cc/edit#gid=0
  async function handleSubscribe() {
    setIsSubscribeLoading(true);
    posthog.capture("$click", {
      $event_type: "subscribe",
      $current_url: window.location.href,
    });
    if (userId && jwtToken) {
      // Has at least one installation
      if (userInfos && userInfos.length > 0) {
        createPortalOrCheckoutURL();
      } else {
        // Signed in but no intallation
        router.push(config.REDIRECT_GITHUB_APP_URL);
      }
    } else {
      // Not signed in, prompt sign in
      await signIn("github", {
        callbackUrl: `/?subscribe`,
      });
    }
  }

  // If "subscribe" in query parameter create checkout session or portal
  useEffect(() => {
    if (searchParams.has("subscribe") && userInfos) {
      createPortalOrCheckoutURL();
    }
  }, [searchParams, userInfos, selectedIndex, userId, jwtToken, router, createPortalOrCheckoutURL]);

  return (
    <div className="w-[100vw] bg-white flex justify-center">
      <div className="mx-10 mt-10 sm:pt-16 text-black">
        <h2 className="text-center text-3xl font-helvetica font-medium" id="pricing">
          <a id="pricing">Pricing</a>
        </h2>

        <div className="flex mt-4 mb-6 lg:mt-0 justify-center lg:justify-end lg:pr-8 ">
          <div className="flex flex-col text-lg ">
            Billing Period
            <select
              className="border  rounded-lg outline-none"
              onChange={(e) => {
                setBillingPeriod(e.target.value);
              }}
              value={billingPeriod}
            >
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row lg:gap-10 px-4 sm:px-8 mt-5 sm:mt-8">
          <div className="flex flex-col p-4 sm:p-6 mb-10 bg-light rounded-xl">
            <h3 className=" text-3xl mx-auto">Free</h3>
            <span className="mt-2 text-2xl mx-auto">$0</span>
            <Link
              href={config.NEXT_PUBLIC_GITHUB_APP_URL as string}
              passHref
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "github_app_install",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-pink hover:bg-pinkHover text-white flex items-center justify-center gap-2 mt-14`}
            >
              <Image
                src="/icons/github.svg"
                width={30}
                height={30}
                className="invert"
                alt="Github Logo"
              />
              Install
            </Link>
            <div className="flex flex-col">
              <span>&bull; {OPENAI_MODEL_NAME}</span>
              <span>&bull; Up to {OPENAI_FREE_TOKENS} tokens</span>
              <span className="ml-3.5"> Up to ~{OPENAI_FREE_LINES} lines of code</span>
              <span className="ml-3.5"> Up to ~{OPENAI_FREE_FILES} files</span>
              <span>&bull; {FREE_TIER_REQUEST_LIMIT} issues per month</span>
            </div>
          </div>
          <div className="flex flex-col p-4 sm:p-6 mb-10 bg-light rounded-xl">
            <h3 className="text-3xl mx-auto">Standard</h3>
            <span className="mt-2 text-2xl mx-auto">
              {billingPeriod === "Monthly" ? "$19/user/mo" : "$190/user/yr"}
            </span>

            {billingPeriod === "Yearly" && <span className="mx-auto">Save $38/user/yr</span>}

            <div className="relative items-center">
              <button
                onClick={() => {
                  handleSubscribe();
                }}
                className={`${pricingButtonStyles} bg-pink hover:bg-pinkHover  text-white  ${
                  isSubscribeLoading && "opacity-0 pointer-events-none"
                }
                ${billingPeriod === "Monthly" ? "mt-14" : "mt-[34px]"} 
                `}
              >
                {selectedIndex != null &&
                userInfosSubscribed &&
                userInfosSubscribed[selectedIndex] === true
                  ? "Manage Plan"
                  : "Subscribe"}
              </button>
              {isSubscribeLoading && (
                <div
                  className={`absolute inset-0 flex items-center justify-center bg-pink hover:bg-pinkHover opacity-50 rounded-lg ${
                    billingPeriod === "Monthly" ? "mt-14 mb-8" : "my-8"
                  } py-3 w-[250px] sm:w-[315px] lg:w-[210px] cursor-not-allowed `}
                >
                  <Spinner size="md" color="white" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <span>&bull; {OPENAI_MODEL_NAME}</span>
              <span>&bull; Up to {OPENAI_MAX_TOKENS} tokens</span>
              <span className="ml-3.5"> Up to ~{OPENAI_MAX_LINES} lines of code</span>
              <span className="ml-3.5"> Up to ~{OPENAI_MAX_FILES} files</span>
              <span>&bull; 30 issues per month</span>
            </div>
          </div>
          <div className="flex flex-col p-4 sm:p-6 mb-10 bg-light rounded-xl">
            <h3 className="text-3xl mx-auto">Enterprise</h3>
            <span className="mt-2 text-xl mx-auto">Custom</span>
            <Link
              href="mailto:info@gitauto.ai"
              passHref
              target="_blank"
              onClick={(event) => {
                posthog.capture("$click", {
                  $event_type: "contact_us",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-pink hover:bg-pinkHover text-white mt-[62px]`}
            >
              Contact Us
            </Link>
            <div className="flex flex-col">
              <span>&bull; {OPENAI_MODEL_NAME}</span>
              <span>&bull; Up to {OPENAI_MAX_TOKENS} tokens</span>
              <span className="ml-3.5"> Up to ~{OPENAI_MAX_LINES} lines of code</span>
              <span className="ml-3.5"> Up to ~{OPENAI_MAX_FILES} files</span>
              <span>&bull; Unlimited Issues</span>
              <span>&bull; Self OpenAI API key</span>
              <span>&bull; Self hosting</span>
              <span>&bull; Fine tuning</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
