// Next imports
import Link from "next/link";
import Image from "next/image";

// Analytics
import { usePostHog } from "posthog-js/react";

export default function Pricing() {
  // Analytics
  const posthog = usePostHog();

  const pricingButtonStyles = `my-8 rounded-lg transition-colors  duration-200 
  text-md sm:text-lg xl:text-xl py-3 w-[210px] shadow-lg hover:shadow-lg 
  cursor-pointer font-semibold text-center mx-auto `;

  return (
    <div className="w-[100vw] bg-white flex justify-center">
      <div className=" py-16 text-black">
        <h2 className="text-center text-3xl" id="pricing">
          <a id="pricing">Pricing</a>
        </h2>
        <div className="flex flex-col lg:flex-row  gap-10 px-8 pt-10 mt-10 bg-light rounded-xl">
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-3xl">$0</h3>
            <span className="mt-2 text-xl">Free</span>
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
              className={`${pricingButtonStyles} bg-pink hover:bg-pinkHover text-white flex items-center justify-center gap-2`}
            >
              <Image
                src="/icons/github.svg"
                width={30}
                height={30}
                alt="Github Logo"
              />
              Install
            </Link>
            <div className="flex flex-col">
              <span>&bull; 5 issues per month</span>
            </div>
          </div>
          <div className="flex flex-col rounded-xl  p-5 mb-5">
            <h3 className="text-3xl">$19 / user / month</h3>
            <span className="mt-2 text-xl">Standard</span>
            <Link
              href="https://buy.stripe.com/4gw15W4HNaBccWkcMM"
              passHref
              onClick={() => {
                posthog.capture("$click", {
                  $event_type: "purchase",
                  $current_url: window.location.href,
                });
              }}
              className={`${pricingButtonStyles} bg-white hover:bg-[#E6E6E6] text-black`}
            >
              Purchase
            </Link>

            <div className="flex flex-col">
              <span>&bull; 30 issues per month</span>
            </div>
          </div>
          <div className="flex flex-col p-5 mb-10">
            <h3 className="text-3xl">Custom</h3>
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
              className={`${pricingButtonStyles} bg-pink hover:bg-pinkHover text-white`}
            >
              Contact Us
            </Link>
            <div className="flex flex-col">
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
