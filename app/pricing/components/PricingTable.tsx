"use client";

import Link from "next/link";
import { Fragment } from "react";
import SubscribeButton from "@/app/components/Button/SubscribeButton";
import { useAccountContext } from "@/app/components/Context/Account";
import { PRICE_FEATURES, TABLE_FEATURES } from "@/config/pricing";
import { ABSOLUTE_URLS } from "@/config/urls";

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

export default function PricingTable() {
  const { billingPeriod } = useAccountContext();

  return (
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
            <th className="py-4 px-6 text-center font-medium text-gray-500 bg-pink-50">Standard</th>
            <th className="py-4 px-6 text-center font-medium text-gray-500">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {/* Get Started */}
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

          {/* Price */}
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

          {/* Features */}
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

          {/* Ready to Get Started */}
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
  );
}
