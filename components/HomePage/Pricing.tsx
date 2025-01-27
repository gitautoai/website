"use client";
// Next imports
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useCallback, useEffect } from "react";

// Analytics
import * as Sentry from "@sentry/nextjs";
import { usePostHog } from "posthog-js/react";

// Components
import { useAccountContext } from "@/components/Context/Account";
import CheckMark from "@/components/Symbol/CheckMark";

// Third Party
import { signIn } from "next-auth/react";
import { Spinner } from "@chakra-ui/react";
import {
  ABSOLUTE_URLS,
  OPENAI_MODEL_GPT_4O,
  OPENAI_MODEL_GPT_4O_MINI,
  OPENAI_MODEL_O1_MINI,
  RELATIVE_URLS,
} from "@/config";

const pricingButtonStyles = `my-4 sm:my-2 md:my-8 rounded-lg transition-colors duration-200 
text-md sm:text-lg xl:text-xl py-2 sm:py-1 md:py-3 w-full shadow-lg hover:shadow-lg 
cursor-pointer font-semibold text-center mx-auto`;

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
    if (selectedIndex) currentIndex = selectedIndex;

    // If user has an installation, create portal or checkout session
    if (userInfos && userInfos.length > 0) {
      const response = await fetch("/api/stripe/create-portal-or-checkout-url", {
        method: "POST",
        body: JSON.stringify({
          userId: userId,
          jwtToken: jwtToken,
          customerId: userInfos[currentIndex].installations.owners.stripe_customer_id,
          email: email,
          ownerType: userInfos[currentIndex].installations.owner_type,
          ownerId: Number(userInfos[currentIndex].installations.owner_id.replace("n", "")),
          ownerName: userInfos[currentIndex].installations.owner_name,
          userName: userInfos[currentIndex].users.user_name,
          billingPeriod: billingPeriod,
        }),
      });

      const res = await response.json();
      router.push(res);
    } else {
      // If not, redirect to installation page
      router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
    }
  }, [email, jwtToken, router, selectedIndex, userId, userInfos, billingPeriod]);

  // Flow: https://docs.google.com/spreadsheets/d/1AK7VPo_68mL2s3lvsKLy3Rox-QvsT5cngiWf2k0r3Cc/edit#gid=0
  async function handleSubscribe() {
    setIsSubscribeLoading(true);
    posthog.capture("$click", { $event_type: "subscribe", $current_url: window.location.href });

    try {
      // Not signed in, prompt sign in
      if (!userId || !jwtToken) {
        await signIn("github", { callbackUrl: `/?subscribe` });
        return;
      }

      // Signed in but no installation
      if (!userInfos || userInfos.length === 0) {
        router.push(RELATIVE_URLS.REDIRECT_TO_INSTALL);
        return;
      }

      // Has at least one installation
      await createPortalOrCheckoutURL();
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error subscribing", error);
    } finally {
      setIsSubscribeLoading(false);
    }
  }

  // If "subscribe" in query parameter create checkout session or portal
  useEffect(() => {
    if (searchParams.has("subscribe") && userInfos) {
      createPortalOrCheckoutURL();
    }
  }, [searchParams, userInfos, selectedIndex, userId, jwtToken, router, createPortalOrCheckoutURL]);

  return (
    <div
      id="pricing"
      className="w-full min-h-screen h-full py-4 md:py-0 flex flex-col justify-center items-center"
    >
      <h2 className="text-3xl md:text-4xl">Pricing</h2>
      <div className="w-full flex justify-center sm:justify-end sm:pr-1 md:pr-4">
        <div className="flex flex-col justify-end sm:justify-end text-lg sm:text-base md:text-lg">
          <span>Billing Period</span>
          <select
            id="billingPeriod"
            name="billingPeriod"
            className="border rounded-lg outline-none"
            onChange={(e) => setBillingPeriod(e.target.value)}
            value={billingPeriod}
          >
            <option>Monthly</option>
            <option>Yearly</option>
          </select>
        </div>
      </div>
      <div className="w-full flex flex-col sm:flex-row sm:gap-4 md:gap-10 sm:justify-center sm:items-stretch px-4 sm:px-0 md:px-4 mt-5 sm:mt-2 md:mt-8 space-y-8 sm:space-y-0">
        {/* Free Plan */}
        <div className="flex flex-col p-4 sm:p-3 md:p-6 sm:w-1/3 bg-stone-200 rounded-xl">
          <div className="flex flex-col sm:h-20 md:h-20">
            <h3 className="text-xl sm:text-lg md:text-2xl mx-auto">Free</h3>
            <span className="mt-2 sm:mt-0 md:mt-2 text-3xl sm:text-xl md:text-3xl mx-auto">$0</span>
          </div>
          <Link
            href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
            target="_blank"
            onClick={() => {
              posthog.capture("$click", {
                $event_type: "github_app_install",
                $current_url: window.location.href,
              });
            }}
            className={`${pricingButtonStyles} bg-pink-600 hover:bg-pink-700 text-white flex items-center justify-center gap-2 sm:mt-1.5 md:mt-14`}
          >
            <Image
              src="/icons/github.svg"
              width={30}
              height={30}
              loading="lazy"
              className="invert"
              alt="Github Logo"
            />
            Install
          </Link>
          <ul className="flex flex-col text-base sm:text-sm md:text-xl space-y-1 list-none list-outside">
            <li><CheckMark /> {OPENAI_MODEL_GPT_4O_MINI}</li>
            <li><CheckMark /> Up to 3 tickets per month</li>
            <li><CheckMark /> GitHub Issue Templates</li>
          </ul>
        </div>

        {/* Standard Plan */}
        <div className="flex flex-col p-4 sm:p-3 md:p-6 sm:w-1/3 bg-stone-200 rounded-xl">
          <div className="flex flex-col sm:h-18 md:h-26">
            <h3 className="text-xl sm:text-lg md:text-2xl mx-auto">Standard</h3>
            <span className="mt-2 sm:mt-0 md:mt-2 text-3xl sm:text-xl md:text-3xl mx-auto">
              {billingPeriod === "Monthly" ? "$100/month" : "$1,000/year"}
            </span>

            {billingPeriod === "Yearly" && <span className="mx-auto">Save $200/year</span>}
          </div>

          <div className="relative items-center">
            <button
              id="subscribe-or-manage-standard"
              name="subscribe-or-manage-standard"
              onClick={handleSubscribe}
              className={`${pricingButtonStyles} bg-pink-600 hover:bg-pink-700 text-white ${
                isSubscribeLoading && "opacity-0 pointer-events-none"
              }`}
            >
              {selectedIndex != null &&
              userInfosSubscribed &&
              userInfosSubscribed[selectedIndex] === true
                ? "Manage Plan"
                : "Subscribe"}
            </button>
            {isSubscribeLoading && (
              <div
                className={`absolute inset-0 flex items-center justify-center bg-pink-600 hover:bg-pink-700 opacity-50 rounded-lg ${
                  billingPeriod === "Monthly" ? "mt-14 mb-8" : "my-8"
                } py-3 w-full mx-auto cursor-not-allowed`}
              >
                <Spinner size="md" color="white" />
              </div>
            )}
          </div>
          <ul className="flex flex-col text-base sm:text-sm md:text-xl space-y-1 list-none list-outside">
            <li><CheckMark /> Everything in Free plan</li>
            <li><CheckMark /> {OPENAI_MODEL_GPT_4O} & {OPENAI_MODEL_O1_MINI}</li>
            <li><CheckMark /> per 10 tickets per month</li>
            <li><CheckMark /> per organization</li>
            <li><CheckMark /> Unlimited repositories</li>
            <li><CheckMark /> Unlimited users</li>
            <li><CheckMark /> Retry on GitHub Actions</li>
            <li><CheckMark /> Daily self-execution</li>
            <li><CheckMark /> Zero Data Retention</li>
          </ul>
        </div>

        {/* Enterprise Plan */}
        <div className="flex flex-col p-4 sm:p-3 md:p-6 sm:w-1/3 bg-stone-200 rounded-xl">
          <div className="flex flex-col sm:h-10 md:h-26">
            <h3 className="text-xl sm:text-lg md:text-2xl mx-auto">Enterprise</h3>
            <span className="mt-2 sm:mt-0 md:mt-2 text-3xl sm:text-xl md:text-3xl mx-auto">
              $Custom
            </span>
          </div>
          <Link
            href="mailto:info@gitauto.ai"
            target="_blank"
            onClick={(event) => {
              posthog.capture("$click", {
                $event_type: "contact_us",
                $current_url: window.location.href,
              });
            }}
            className={`${pricingButtonStyles} bg-pink-600 hover:bg-pink-700 text-white sm:mt-12 md:mt-8`}
          >
            Contact Us
          </Link>
          <ul className="flex flex-col text-base sm:text-sm md:text-xl space-y-1 list-none list-outside">
            <li><CheckMark /> Everything in Standard plan</li>
            <li>
              <CheckMark /> {OPENAI_MODEL_GPT_4O} & {OPENAI_MODEL_O1_MINI}
            </li>
            <li><CheckMark /> Unlimited tickets</li>
            <li><CheckMark /> Self OpenAI API key</li>
            <li><CheckMark /> Self hosting</li>
            <li><CheckMark /> SAML / SSO</li>
            <li><CheckMark /> Fine tuning with your data</li>
            <li><CheckMark /> Dedicated Customer Support</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
