"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { slackUs } from "@/app/actions/slack/slack-us";
import { useAccountContext } from "@/app/components/contexts/Account";
import { RELATIVE_URLS } from "@/config/urls";

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION, label: "Installation" },
      { href: RELATIVE_URLS.DOCS.GETTING_STARTED.SETUP, label: "Setup" },
    ],
  },
  {
    title: "Triggers",
    items: [
      { href: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW, label: "Overview" },
      { href: RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE, label: "Schedule Trigger" },
      { href: RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE, label: "Test Failure Trigger" },
      { href: RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT, label: "Review Comment Trigger" },
      { href: RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD, label: "Dashboard Trigger" },
    ],
  },
  {
    title: "Coverage Dashboard",
    items: [
      { href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW, label: "Overview" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.PYTHON, label: "Python Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT, label: "JavaScript Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.JAVA, label: "Java Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.GO, label: "Go Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.PHP, label: "PHP Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.RUBY, label: "Ruby Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.FLUTTER, label: "Flutter Testing" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE, label: "Multi-Language" },
      { href: RELATIVE_URLS.DOCS.COVERAGE.CHARTS, label: "Coverage Charts" },
    ],
  },
  {
    title: "Customization",
    items: [
      { href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES, label: "Repository Rules" },
    ],
  },
  {
    title: "Integrations",
    items: [
      { href: RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI, label: "CircleCI Integration" },
      { href: RELATIVE_URLS.DOCS.INTEGRATIONS.NPM, label: "npm Integration" },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, userName } = useAccountContext();

  useEffect(() => {
    if (!userId || !userName) return;
    slackUs(`${userName} (${userId}) visited docs: ${pathname}`).catch(console.error);
  }, [userId, userName, pathname]);

  return (
    <div className="min-h-[calc(100vh-64px)] pt-28">
      <div className="flex flex-col md:flex-row md:justify-around gap-8 lg:gap-12 h-full">
        {/* Main Content */}
        <main className="flex-1 max-w-3xl">{children}</main>

        {/* Sidebar - Desktop */}
        <div className="hidden lg:block w-56 relative">
          <div className="sticky top-8 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <nav className="space-y-1">
              {sidebarItems.map((section, idx) => (
                <div key={idx}>
                  <h3 className="font-medium text-gray-900 text-sm mb-2">{section.title}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={`block py-1 px-2 rounded-md text-sm transition-colors ${
                            pathname === item.href
                              ? "bg-pink-50 text-pink-600"
                              : "text-gray-600 hover:text-pink-600"
                          }`}
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden">
          <select
            value={pathname}
            onChange={(e) => (window.location.href = e.target.value)}
            className="w-full p-2 text-sm border rounded-md"
          >
            {sidebarItems.map((section) =>
              section.items.map((item) => (
                <option key={item.href} value={item.href}>
                  {section.title} - {item.label}
                </option>
              )),
            )}
          </select>
        </div>
      </div>
    </div>
  );
}
