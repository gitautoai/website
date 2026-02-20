"use client";

// Third-party imports
import Link from "next/link";

// Local imports
import CreditPurchaseButton from "@/app/dashboard/credits/components/CreditPurchaseButton";
import { CREDIT_PRICING, FREE_CREDITS_AMOUNT_USD } from "@/config/pricing";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export default function Pricing() {
  return (
    <section id="pricing" className="w-full py-20" aria-label="Pricing section">
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">Pricing</h2>
      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Pay per PR. No subscriptions, no commitments.
      </p>

      {/* Single price hero */}
      <div className="max-w-2xl mx-auto text-center mb-12">
        <div className="mb-6">
          <span className="text-5xl md:text-6xl font-bold">
            ${CREDIT_PRICING.PER_PR.AMOUNT_USD}
          </span>
          <span className="text-2xl md:text-3xl text-gray-600"> / PR</span>
        </div>
        <p className="text-lg text-gray-600 mb-8">
          Start with ${FREE_CREDITS_AMOUNT_USD} in free credits. Buy more when you need them.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
            target="_blank"
            className="px-8 py-3 rounded-lg font-semibold border border-pink-600 text-pink-600 hover:bg-pink-50 transition-colors"
          >
            Install Free
          </Link>
          <CreditPurchaseButton className="px-8 py-3" />
        </div>
      </div>

      <p className="text-center text-gray-500 mb-8">
        Need something custom?{" "}
        <Link href={RELATIVE_URLS.CONTACT} className="text-pink-600 hover:underline">
          Contact us
        </Link>
      </p>

      {/* Link to detailed comparison */}
      <div className="text-center">
        <Link
          href={RELATIVE_URLS.PRICING_DETAILS}
          className="inline-flex items-center text-pink-600 hover:text-pink-800 font-medium"
        >
          View detailed feature comparison{" "}
          <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5l7 7-7 7"
            ></path>
          </svg>
        </Link>
      </div>
    </section>
  );
}
