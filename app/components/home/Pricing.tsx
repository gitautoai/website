"use client";

// Third-party imports
import Link from "next/link";
import { useState } from "react";

// Local imports
import { PricingPlan } from "@/app/components/home/PricingPlan";
import { FREE_FEATURES, STANDARD_FEATURES, ENTERPRISE_FEATURES } from "@/config/pricing";
import { ABSOLUTE_URLS, RELATIVE_URLS } from "@/config/urls";

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<string>("Monthly");

  return (
    <section
      id="pricing"
      className="w-full max-w-6xl mx-auto py-20 px-4"
      aria-label="Pricing section"
    >
      <h2 className="text-2xl md:text-4xl font-bold mb-4 text-center">Pricing</h2>
      <p className="text-center text-gray-600 max-w-4xl mx-auto mb-8">
        Start for free, scale as your testing needs grow. No credit card required to get started.
      </p>

      {/* Billing Toggle */}
      <div className="flex justify-center mb-10">
        <div className="inline-flex items-center bg-gray-100 p-1 rounded-full">
          <button
            className={`px-5 py-2 rounded-full text-sm transition-all duration-200 ${
              billingPeriod === "Monthly"
                ? "bg-white shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setBillingPeriod("Monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm transition-all duration-200 flex items-center gap-2 ${
              billingPeriod === "Yearly"
                ? "bg-white shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setBillingPeriod("Yearly")}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Save 17%
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free Plan */}
        <PricingPlan
          title="Free"
          price={<span className="text-3xl font-bold">$0</span>}
          description="Perfect for trying out GitAuto"
          features={FREE_FEATURES}
          action={{
            text: "Install Free",
            href: ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO,
            target: "_blank",
            style: "outline",
          }}
        />

        {/* Standard Plan */}
        <PricingPlan
          recommended
          title="Standard"
          price={
            <div>
              <span className="text-3xl font-bold">
                {billingPeriod === "Monthly" ? "$100/month" : "$1,000/year"}
              </span>
              {billingPeriod === "Yearly" && (
                <div className="text-green-600 text-sm mt-1">Save $200/year</div>
              )}
            </div>
          }
          description="Perfect for teams looking to boost test coverage"
          features={STANDARD_FEATURES}
          action={{
            isSubscribe: true,
            billingPeriod: billingPeriod,
            style: "primary",
          }}
        />

        {/* Enterprise Plan */}
        <PricingPlan
          title="Enterprise"
          price={
            <div>
              <span className="text-3xl font-bold">
                {billingPeriod === "Monthly" ? "$500+/month" : "$5,000+/year"}
              </span>
              {billingPeriod === "Yearly" && (
                <div className="text-green-600 text-sm mt-1">Save $1,000+/year</div>
              )}
            </div>
          }
          description="Perfect for large teams or custom options"
          features={ENTERPRISE_FEATURES}
          action={{
            text: "Contact Us",
            href: RELATIVE_URLS.CONTACT,
            target: "_self",
            style: "outline",
          }}
        />
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-xl font-semibold mb-4">Not sure which plan is right for you?</h3>
        <Link
          href={RELATIVE_URLS.PRICING_DETAILS}
          className="inline-flex  items-center text-pink-600 hover:text-pink-800 font-medium"
        >
          View detailed pricing comparison{" "}
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
