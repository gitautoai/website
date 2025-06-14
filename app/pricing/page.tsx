"use client";

// Third-party imports
import { Metadata } from "next";
import Link from "next/link";
import { Fragment, useState } from "react";

// Local imports
import SubscribeButton from "@/app/components/Button/SubscribeButton";
import FAQ from "@/app/components/HomePage/FAQ";
import { pricingStructuredData } from "@/app/pricing/jsonld";
import { PRICE_FEATURES, TABLE_FEATURES } from "@/config/pricing";
import { ABSOLUTE_URLS } from "@/config/urls";

const metadata: Metadata = {
  title: "GitAuto Pricing - Test Coverage Automation Plans",
  description:
    "Choose the GitAuto plan that fits your team's needs. Scale from 0% to 90% test coverage without manual effort.",
  keywords:
    "GitAuto pricing, test automation pricing, test coverage plans, GitHub testing automation",
};

const CheckMark = () => (
  <div className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-green-100 text-green-600">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20 6L9 17L4 12"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

const XMark = () => (
  <div className="flex items-center justify-center w-6 md:w-8 h-6 md:h-8 rounded-full bg-red-100 text-red-600">
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M18 6L6 18M6 6L18 18"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<string>("Monthly");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
      />
      <div className="flex flex-col items-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          Choose the plan that fits your team&apos;s needs. All plans include our core test
          generation capabilities.
        </p>

        <div className="inline-flex items-center bg-gray-100 p-1 rounded-full mb-12">
          <button
            className={`px-5 py-2 rounded-full text-sm transition-all ${
              billingPeriod === "Monthly"
                ? "bg-white shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setBillingPeriod("Monthly")}
          >
            Monthly
          </button>
          <button
            className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
              billingPeriod === "Yearly"
                ? "bg-white shadow-sm font-medium"
                : "text-gray-600 hover:text-gray-800"
            }`}
            onClick={() => setBillingPeriod("Yearly")}
          >
            Yearly
            <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
              Save 16%
            </span>
          </button>
        </div>

        {/* Comparison Table */}
        <div className="max-w-5xl w-full mx-auto">
          <table className="w-full border-collapse">
            <colgroup>
              <col style={{ width: "40%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-4 px-6 text-left font-medium text-gray-500">Features</th>
                <th className="py-4 px-6 text-center font-medium text-gray-500">Free</th>
                <th className="py-4 px-6 text-center font-medium text-gray-500 bg-pink-50">
                  Standard
                </th>
                <th className="py-4 px-6 text-center font-medium text-gray-500">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {/* Top button row */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Get Started</td>
                <td className="py-4 px-6 text-center">
                  <Link
                    href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
                    target="_blank"
                    className="inline-block py-2 px-4 rounded-lg font-medium border border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    Install Free
                  </Link>
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <SubscribeButton
                    billingPeriod={billingPeriod}
                    className="inline-block py-2 px-4 w-full"
                  />
                </td>
                <td className="py-4 px-6 text-center">
                  <Link
                    href="/contact"
                    className="inline-block py-2 px-4 rounded-lg font-medium border border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    Contact Us
                  </Link>
                </td>
              </tr>

              {/* Price Row */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">
                  {PRICE_FEATURES[0].name}
                  <div className="text-sm text-gray-500">{PRICE_FEATURES[0].description}</div>
                </td>
                <td className="py-4 px-6 text-center">{PRICE_FEATURES[0].free}</td>
                <td className="py-4 px-6 text-center font-medium bg-pink-50">
                  {billingPeriod === "Monthly"
                    ? PRICE_FEATURES[0].standard
                    : PRICE_FEATURES[0].standardYearly}
                  <br />
                  <span className="text-sm text-gray-500">
                    {billingPeriod === "Yearly" && "Save $200/year"}
                  </span>
                </td>
                <td className="py-4 px-6 text-center">
                  {billingPeriod === "Monthly"
                    ? PRICE_FEATURES[0].enterprise
                    : PRICE_FEATURES[0].enterpriseYearly}
                  <br />
                  <span className="text-sm text-gray-500">Custom pricing</span>
                </td>
              </tr>

              {/* Feature Rows */}
              {TABLE_FEATURES.map((section) => (
                <Fragment key={section.category}>
                  <tr className="border-b border-gray-200">
                    <td colSpan={4} className="pt-10 pb-4 px-6 font-semibold">
                      {section.category}
                    </td>
                  </tr>
                  {section.items.map((item, idx) => (
                    <tr key={`${section.category}-${idx}`} className="border-b border-gray-200">
                      <td className="py-4 px-6 font-medium">
                        {item.name}
                        {item.description && (
                          <div className="text-sm text-gray-500">{item.description}</div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof item.free === "string" ? (
                          item.free
                        ) : (
                          <div className="flex justify-center items-center">
                            {item.free ? <CheckMark /> : <XMark />}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-pink-50">
                        {typeof item.standard === "string" ? (
                          item.standard
                        ) : (
                          <div className="flex justify-center items-center">
                            {item.standard ? <CheckMark /> : <XMark />}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof item.enterprise === "string" ? (
                          item.enterprise
                        ) : (
                          <div className="flex justify-center items-center">
                            {item.enterprise ? <CheckMark /> : <XMark />}
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}

              {/* Bottom button row */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Ready to Get Started?</td>
                <td className="py-4 px-6 text-center">
                  <Link
                    href={ABSOLUTE_URLS.GITHUB.INSTALL_GITAUTO}
                    target="_blank"
                    className="inline-block py-2 px-4 rounded-lg font-medium border border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    Install Free
                  </Link>
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <SubscribeButton
                    billingPeriod={billingPeriod}
                    className="inline-block py-2 px-4 w-full"
                  />
                </td>
                <td className="py-4 px-6 text-center">
                  <Link
                    href="/contact"
                    className="inline-block py-2 px-4 rounded-lg font-medium border border-pink-600 text-pink-600 hover:bg-pink-50"
                  >
                    Contact Us
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="max-w-5xl w-full mx-auto mt-16">
          <FAQ initialCategory="pricing" />
        </div>
      </div>
    </>
  );
}
