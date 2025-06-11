"use client";

// Third-party imports
import { Metadata } from "next";
import React, { useState } from "react";

// Local imports
import FAQ from "@/app/components/HomePage/FAQ";
import { ANTHROPIC_MODEL_CLAUDE_40 } from "@/config/anthropic";
import { DEEPSEEK_MODEL_R1 } from "@/config/deepseek";
import { OPENAI_MODEL_O4_MINI } from "@/config/openai";

const metadata: Metadata = {
  title: "GitAuto Pricing - Test Coverage Automation Plans",
  description:
    "Choose the GitAuto plan that fits your team's test automation needs. Scale from 0% to 90% test coverage without manual effort.",
  keywords:
    "GitAuto pricing, test automation pricing, test coverage plans, GitHub testing automation",
};

const CheckMark = () => (
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-green-100 text-green-600">
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
  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600">
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

export const plans = [
  {
    name: "Free",
    highlight: false,
    price: "$0",
    yearlyPrice: null,
    prCount: "3 PRs/month",
    model: ANTHROPIC_MODEL_CLAUDE_40,
  },
  {
    name: "Standard",
    highlight: true,
    price: "$100/month",
    yearlyPrice: "$1,000/year",
    prCount: "20 PRs/month per GitHub Org",
    prSubtext: "Scale by adding quantity at checkout",
    model: ANTHROPIC_MODEL_CLAUDE_40,
  },
  {
    name: "Enterprise",
    highlight: false,
    price: "From $500/month",
    yearlyPrice: "From $5,000/year",
    prCount: "200+ PRs/month",
    model: `${ANTHROPIC_MODEL_CLAUDE_40}, ${OPENAI_MODEL_O4_MINI}, and ${DEEPSEEK_MODEL_R1}`,
  },
];

export const coreFeatures = [
  {
    name: "Coverage Report Import",
    description: "Import code coverage reports from your CI pipeline",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Coverage Dashboard Trigger",
    description: "Create tests directly from the coverage dashboard",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Repository Rules",
    description: "Configure which repositories GitAuto can access",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Reference URL",
    description: "Add URLs to documentation to help GitAuto understand your code",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Reference File",
    description: "Add files for GitAuto to reference when creating tests",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Custom Base Branch",
    description: "Choose which branch GitAuto uses as the base for new PRs",
    free: false,
    standard: true,
    enterprise: true,
  },
];

export const triggers = [
  {
    name: "Issue Checkbox",
    description: "Trigger GitAuto by checking a box in an issue",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Issue Label",
    description: "Trigger GitAuto by adding a label to an issue",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Test Failure",
    description: "GitAuto fixes failing tests automatically",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Review Comment",
    description: "Trigger GitAuto by adding a comment to a PR",
    free: true,
    standard: true,
    enterprise: true,
  },
  {
    name: "Commit",
    description: "GitAuto adds tests after each commit",
    free: false,
    standard: true,
    enterprise: true,
  },
  {
    name: "Merge",
    description: "GitAuto creates tests after PR merges",
    free: false,
    standard: true,
    enterprise: true,
  },
  {
    name: "Schedule",
    description: "Run GitAuto on a regular schedule",
    free: false,
    standard: true,
    enterprise: true,
  },
];

export const advancedFeatures = [
  {
    name: "Self LLM API Key",
    description: "Use your own API keys for AI models",
    free: false,
    standard: false,
    enterprise: true,
  },
  {
    name: "Self Hosting",
    description: "Host GitAuto on your own infrastructure",
    free: false,
    standard: false,
    enterprise: true,
  },
  {
    name: "SAML / SSO",
    description: "Enterprise single sign-on integration",
    free: false,
    standard: false,
    enterprise: true,
  },
  {
    name: "Fine Tuning",
    description: "Custom model training on your codebase",
    free: false,
    standard: false,
    enterprise: true,
  },
  {
    name: "Dedicated Support",
    description: "Direct access to GitAuto engineers",
    free: false,
    standard: false,
    enterprise: true,
  },
];

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<string>("Monthly");

  return (
    <main className="flex flex-col items-center pb-20">
      <div className="w-full mt-40">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that fits your team's needs. All plans include our core test generation
            capabilities.
          </p>
        </div>
      </div>

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
              Save 16%
            </span>
          </button>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="max-w-6xl w-full mx-auto px-4 mt-16">
        <div className="overflow-x-auto">
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
              {/* Price Row */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Price</td>
                <td className="py-4 px-6 text-center">$0</td>
                <td className="py-4 px-6 text-center font-medium bg-pink-50">
                  $100/month
                  <br />
                  <span className="text-sm text-gray-500">($1,000/year)</span>
                </td>
                <td className="py-4 px-6 text-center">
                  From $500/month
                  <br />
                  <span className="text-sm text-gray-500">(From $5,000/year)</span>
                </td>
              </tr>

              {/* PR Allowance */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td className="py-4 px-6 font-medium">Pull Requests</td>
                <td className="py-4 px-6 text-center">3 PRs/month</td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  20 PRs/month per GitHub Org
                  <br />
                  <span className="text-sm text-gray-500">
                    Scale by adding quantity at checkout
                  </span>
                </td>
                <td className="py-4 px-6 text-center">200+ PRs/month</td>
              </tr>

              {/* Model */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">AI Models</td>
                <td className="py-4 px-6 text-center">{ANTHROPIC_MODEL_CLAUDE_40}</td>
                <td className="py-4 px-6 text-center bg-pink-50">{ANTHROPIC_MODEL_CLAUDE_40}</td>
                <td className="py-4 px-6 text-center">
                  {ANTHROPIC_MODEL_CLAUDE_40}, {OPENAI_MODEL_O4_MINI}, {DEEPSEEK_MODEL_R1}, etc.
                </td>
              </tr>

              {/* Core Features Header */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td colSpan={4} className="py-3 px-6 font-semibold">
                  Core Features
                </td>
              </tr>

              {/* Core Features */}
              {coreFeatures.map((feature, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-4 px-6 font-medium">
                    {feature.name}
                    {feature.description && (
                      <div className="text-sm text-gray-500">{feature.description}</div>
                    )}
                  </td>
                  <td className="py-4 px-6 flex justify-center">
                    {feature.free ? <CheckMark /> : <XMark />}
                  </td>
                  <td className="py-4 px-6 text-center bg-pink-50">
                    {feature.standard ? <CheckMark /> : <XMark />}
                  </td>
                  <td className="py-4 px-6 text-center">
                    {feature.enterprise ? <CheckMark /> : <XMark />}
                  </td>
                </tr>
              ))}

              {/* Triggers Header */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td colSpan={4} className="py-3 px-6 font-semibold">
                  Triggers
                </td>
              </tr>

              {/* Trigger Rows */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Issue Checkbox</td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Issue Label</td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Test Failure</td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Review Comment</td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Commit</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Merge</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Schedule</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <CheckMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>

              {/* Advanced Features Header */}
              <tr className="border-b border-gray-200 bg-gray-50">
                <td colSpan={4} className="py-3 px-6 font-semibold">
                  Advanced Features
                </td>
              </tr>

              {/* Advanced Feature Rows */}
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Self LLM API Key</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Self Hosting</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">SAML / SSO</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Fine Tuning</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
              <tr className="border-b border-gray-200">
                <td className="py-4 px-6 font-medium">Dedicated Support</td>
                <td className="py-4 px-6 text-center">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center bg-pink-50">
                  <XMark />
                </td>
                <td className="py-4 px-6 text-center">
                  <CheckMark />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Reusing the FAQ component with pricing as active category */}
      <div className="max-w-5xl w-full mx-auto px-4 mt-16">
        <FAQ initialCategory="pricing" />
      </div>
    </main>
  );
}
