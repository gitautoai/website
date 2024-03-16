import Link from "next/link";

import Image from "next/image";

// Analytics
import { usePostHog } from "posthog-js/react";

export default function Pricing() {
  // Analytics
  const posthog = usePostHog();

  const pricingButtonStyles = `my-8 rounded-lg transition-colors  duration-200 
  text-md footerSM:text-lg xl:text-xl py-3 px-8 mx-auto shadow-lg hover:shadow-lg 
  cursor-pointer hover:bg-blueHover font-semibold text-center nav:w-auto`;

  return (
    <div className="w-[98vw] ml:w-[95vw] lg:w-[90vw] xl:w-[80vw] xxl:w-[1280px] my-10 ">
      {/* Web View */}
      <div className="hidden lg:flex flex-col items-center justify-evenly gap-8 ">
        <h2 className="text-5xl" id="pricing">
          <a id="pricing">Pricing</a>
        </h2>
        <div className="flex">
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-5xl">Free</h3>
            <span className="mt-2 text-xl">Starter</span>
            <Link
              href="https://github.com/apps/gitauto-ai"
              passHref
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "github_app_install",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-blue text-white flex items-center gap-2`}
            >
              <Image
                src="/github.svg"
                width={30}
                height={30}
                alt="Github Logo"
              />
              Install
            </Link>
            <div className="flex flex-col">
              <span>&bull; 2 issues per month</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
          <div className="flex flex-col rounded-xl bg-blue p-5 mb-5">
            <h3 className="text-5xl">$19</h3>
            <span className="mt-2 text-xl">Individual</span>
            <Link
              href="https://buy.stripe.com/4gw15W4HNaBccWkcMM"
              passHref
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "purchase",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-white hover:bg-[#E6E6E6] text-black   flex items-center gap-2`}
            >
              Purchase
            </Link>

            <div className="flex flex-col">
              <span>&bull; 20 issues per month</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-5xl">Custom</h3>
            <span className="mt-2 text-xl">Enterprise</span>
            <Link
              href="mailto:info@gitauto.ai"
              passHref
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "contact_us",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-blue text-white mx-auto  flex items-center gap-2`}
            >
              Contact Us
            </Link>
            <div className="flex flex-col">
              <span>&bull; 20+ issues/month per user</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
        </div>
      </div>
      {/* Mobile View */}
      <div className="flex lg:hidden flex-col items-center justify-evenly gap-8 ">
        <h2 className="text-5xl">
          <a id="pricing">Pricing</a>
        </h2>
        <div className="flex flex-col">
          <div className="flex flex-col rounded-xl bg-blue p-5 mb-5">
            <h3 className="text-5xl">$19</h3>
            <span className="mt-2 text-xl">Individual</span>
            <Link
              href="https://buy.stripe.com/4gw15W4HNaBccWkcMM"
              passHref
              // onClick={onSubmit}
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "purchase",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-darkBlue hover:bg-darkBlueHover text-white   flex items-center gap-2`}
            >
              Purchase
            </Link>

            <div className="flex flex-col">
              <span>&bull; 20 issues per month</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-5xl">Free</h3>
            <span className="mt-2 text-xl">Starter</span>
            <Link
              href="https://github.com/apps/gitauto-ai"
              passHref
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "github_app_install",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-blue text-white flex items-center gap-2`}
            >
              <Image
                src="/github.svg"
                width={30}
                height={30}
                alt="Github Logo"
              />
              Install
            </Link>
            <div className="flex flex-col">
              <span>&bull; 2 issues per month</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-5xl">Custom</h3>
            <span className="mt-2 text-xl">Enterprise</span>
            <Link
              href="mailto:info@gitauto.ai"
              passHref
              target="_blank"
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "contact_us",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-blue text-white mx-auto  flex items-center gap-2`}
            >
              Contact Us
            </Link>
            <div className="flex flex-col">
              <span>&bull; 20+ issues/month per user</span>
              <span>&bull; Solve bugs and implement features</span>
              <span>&bull; Chat with issue and PR to modify PR</span>
              <span>&bull; Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
