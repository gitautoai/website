"use client";

import Link from "next/link";
import {
  FaChartLine,
  FaClipboardList,
  FaCodeBranch,
  FaCog,
  FaCoins,
  FaFileAlt,
  FaPlug,
  FaRocket,
  FaScroll,
  FaUser,
} from "react-icons/fa";
import { RELATIVE_URLS } from "@/config/urls";

const sections = [
  {
    title: "Dashboard",
    items: [
      {
        href: RELATIVE_URLS.DASHBOARD.COVERAGE_TRENDS,
        icon: FaChartLine,
        label: "Coverage Trends",
        description: "Historical coverage charts over time",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.FILE_COVERAGE,
        icon: FaFileAlt,
        label: "File Coverage",
        description: "File-level coverage and bulk PR creation",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.USAGE,
        icon: FaClipboardList,
        label: "Usage",
        description: "PR statistics and analytics",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.CREDITS,
        icon: FaCoins,
        label: "Credits",
        description: "Balance, auto-reload, and transactions",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.PRS,
        icon: FaCodeBranch,
        label: "Pull Requests",
        description: "Open PRs across your repositories",
      },
    ],
  },
  {
    title: "Settings",
    items: [
      {
        href: RELATIVE_URLS.DASHBOARD.GENERAL,
        icon: FaUser,
        label: "General",
        description: "Profile and account info",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.TRIGGERS,
        icon: FaRocket,
        label: "Triggers",
        description: "Review comment, test failure, and schedule triggers",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.RULES,
        icon: FaScroll,
        label: "Rules",
        description: "Test generation rules and target branch",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.REFERENCES,
        icon: FaFileAlt,
        label: "References",
        description: "Reference docs and file paths",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.ACTIONS,
        icon: FaCog,
        label: "Actions",
        description: "Auto-merge and post-PR behaviors",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        href: RELATIVE_URLS.DASHBOARD.INTEGRATIONS.CIRCLECI,
        icon: FaPlug,
        label: "CircleCI",
        description: "Manage CircleCI access token",
      },
      {
        href: RELATIVE_URLS.DASHBOARD.INTEGRATIONS.NPM,
        icon: FaPlug,
        label: "npm",
        description: "Manage npm access token",
      },
    ],
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {sections.map((section) => (
        <div key={section.title}>
          <h2 className="text-sm font-semibold text-gray-500 mt-0 mb-3">{section.title}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-pink-300 hover:bg-pink-50 transition-colors min-h-[102px]"
              >
                <item.icon className="h-5 w-5 text-pink-600 mt-0.5 shrink-0" />
                <div>
                  <div className="font-medium text-gray-900">{item.label}</div>
                  <div className="text-sm text-gray-500">{item.description}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
