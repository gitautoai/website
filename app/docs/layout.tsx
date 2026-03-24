"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { slackUs } from "@/app/actions/slack/slack-us";
import { useAccountContext } from "@/app/components/contexts/Account";
import { RELATIVE_URLS } from "@/config/urls";

const UTH = RELATIVE_URLS.DOCS.HOW_IT_WORKS;

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
      { href: RELATIVE_URLS.DOCS.CUSTOMIZATION.OUTPUT_LANGUAGE, label: "Output Language" },
      { href: RELATIVE_URLS.DOCS.CUSTOMIZATION.GITAUTO_MD, label: "GITAUTO.md" },
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

const howItWorksCategories = [
  {
    title: "Context Enrichment",
    items: [
      { href: UTH.CONTEXT_ENRICHMENT.LINE_NUMBERS, label: "Line Numbers" },
      { href: UTH.CONTEXT_ENRICHMENT.FULL_FILE_READS, label: "Full File Reads" },
      { href: UTH.CONTEXT_ENRICHMENT.TEST_FILE_PRELOADING, label: "Test File Preloading" },
      { href: UTH.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION, label: "Test Naming Detection" },
      { href: UTH.CONTEXT_ENRICHMENT.ERROR_BASELINES, label: "Error Baselines" },
      { href: UTH.CONTEXT_ENRICHMENT.CI_LOG_CLEANING, label: "CI Log Cleaning" },
      { href: UTH.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS, label: "Trigger-Specific Prompts" },
      { href: UTH.CONTEXT_ENRICHMENT.CODING_STANDARDS, label: "Coding Standards" },
    ],
  },
  {
    title: "Output Auto-Correction",
    items: [
      { href: UTH.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR, label: "Diff Hunk Repair" },
      { href: UTH.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR, label: "Diff Prefix Repair" },
      { href: UTH.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION, label: "Tool Name Correction" },
      {
        href: UTH.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION,
        label: "Tool Argument Correction",
      },
      { href: UTH.OUTPUT_AUTO_CORRECTION.IMPORT_SORTING, label: "Import Sorting" },
      { href: UTH.OUTPUT_AUTO_CORRECTION.TRAILING_SPACE_REMOVAL, label: "Trailing Space Removal" },
      { href: UTH.OUTPUT_AUTO_CORRECTION.FINAL_NEWLINE, label: "Final Newline" },
      {
        href: UTH.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION,
        label: "Line Ending Preservation",
      },
      {
        href: UTH.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS,
        label: "Sanitize Tool Arguments",
      },
      { href: UTH.OUTPUT_AUTO_CORRECTION.LINT_DISABLE_HEADERS, label: "Lint Disable Headers" },
    ],
  },
  {
    title: "Quality Verification",
    items: [
      { href: UTH.QUALITY_VERIFICATION.FORMATTING, label: "Formatting" },
      { href: UTH.QUALITY_VERIFICATION.LINTING, label: "Linting" },
      { href: UTH.QUALITY_VERIFICATION.TYPE_CHECKING, label: "Type Checking" },
      { href: UTH.QUALITY_VERIFICATION.TEST_EXECUTION, label: "Test Execution" },
      { href: UTH.QUALITY_VERIFICATION.COVERAGE_ENFORCEMENT, label: "Coverage Enforcement" },
      { href: UTH.QUALITY_VERIFICATION.PHPUNIT_SUPPORT, label: "PHPUnit Support" },
      { href: UTH.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE, label: "Snapshot Auto-Update" },
      { href: UTH.QUALITY_VERIFICATION.UNTESTABLE_DETECTION, label: "Untestable Detection" },
      { href: UTH.QUALITY_VERIFICATION.SHOULD_SKIP_DETECTION, label: "Should-Skip Detection" },
      { href: UTH.QUALITY_VERIFICATION.DEAD_CODE_REMOVAL, label: "Dead Code Removal" },
    ],
  },
  {
    title: "Safety Guardrails",
    items: [
      { href: UTH.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS, label: "File Edit Restrictions" },
      { href: UTH.SAFETY_GUARDRAILS.TEMPERATURE_ZERO, label: "Temperature Zero" },
      { href: UTH.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS, label: "PR/Branch Checks" },
      { href: UTH.SAFETY_GUARDRAILS.RACE_CONDITION_PREVENTION, label: "Race Condition Prevention" },
      { href: UTH.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION, label: "Bot Loop Prevention" },
      { href: UTH.SAFETY_GUARDRAILS.WEBHOOK_DEDUPLICATION, label: "Webhook Deduplication" },
      { href: UTH.SAFETY_GUARDRAILS.DUPLICATE_ERROR_HASHING, label: "Duplicate Error Hashing" },
      {
        href: UTH.SAFETY_GUARDRAILS.INFRASTRUCTURE_FAILURE_DETECTION,
        label: "Infra Failure Detection",
      },
      { href: UTH.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS, label: "Strict Tool Schemas" },
      { href: UTH.SAFETY_GUARDRAILS.NO_CHANGE_DETECTION, label: "No-Change Detection" },
    ],
  },
  {
    title: "Token/Cost Management",
    items: [
      { href: UTH.TOKEN_COST_MANAGEMENT.TOKEN_TRIMMING, label: "Token Trimming" },
      { href: UTH.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL, label: "Outdated Diff Removal" },
      { href: UTH.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT, label: "Stale File Replacement" },
      { href: UTH.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE, label: "Skip CI Intermediate" },
    ],
  },
  {
    title: "Resilience & Recovery",
    items: [
      { href: UTH.RESILIENCE_RECOVERY.MODEL_FALLBACK, label: "Model Fallback" },
      { href: UTH.RESILIENCE_RECOVERY.OVERLOAD_RETRY, label: "Overload Retry" },
      { href: UTH.RESILIENCE_RECOVERY.FORCED_VERIFICATION, label: "Forced Verification" },
      { href: UTH.RESILIENCE_RECOVERY.ERROR_FILES_EDITABLE, label: "Error Files Editable" },
    ],
  },
  {
    title: "Hallucination Prevention",
    items: [
      { href: UTH.HALLUCINATION_PREVENTION.WEB_SEARCH, label: "Web Search" },
      { href: UTH.HALLUCINATION_PREVENTION.URL_FETCHING, label: "URL Fetching" },
      {
        href: UTH.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS,
        label: "Anti-Hallucination Prompts",
      },
      {
        href: UTH.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS,
        label: "GITAUTO.md Restrictions",
      },
      {
        href: UTH.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS,
        label: "Review Response Guardrails",
      },
    ],
  },
];

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userId, userName } = useAccountContext();
  const isHowItWorks = pathname.startsWith("/docs/how-it-works");
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!userId || !userName) return;
    slackUs(`${userName} (${userId}) visited docs: ${pathname}`).catch(console.error);
  }, [userId, userName, pathname]);

  // Auto-expand the category containing the current page
  useEffect(() => {
    if (!isHowItWorks) return;
    for (const cat of howItWorksCategories) {
      if (cat.items.some((item) => pathname === item.href))
        setExpandedCategories((prev) => ({ ...prev, [cat.title]: true }));
    }
  }, [pathname, isHowItWorks]);

  const toggleCategory = (title: string) =>
    setExpandedCategories((prev) => ({ ...prev, [title]: !prev[title] }));

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

              {/* How It Works */}
              <div>
                <h3 className="font-medium text-gray-900 text-sm mb-2">How It Works</h3>
                <ul className="space-y-0.5">
                  {howItWorksCategories.map((cat) => (
                    <li key={cat.title}>
                      <button
                        onClick={() => toggleCategory(cat.title)}
                        className={`flex items-center gap-1 w-full py-1 px-2 rounded-md text-sm transition-colors text-left ${
                          cat.items.some((i) => pathname === i.href)
                            ? "text-pink-600 font-medium"
                            : "text-gray-600 hover:text-pink-600"
                        }`}
                      >
                        {expandedCategories[cat.title] ? (
                          <FaChevronDown className="h-2.5 w-2.5 shrink-0" />
                        ) : (
                          <FaChevronRight className="h-2.5 w-2.5 shrink-0" />
                        )}
                        {cat.title}
                      </button>
                      {expandedCategories[cat.title] && (
                        <ul className="ml-4 space-y-0.5">
                          {cat.items.map((item) => (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                className={`block py-0.5 px-2 rounded-md text-xs transition-colors ${
                                  pathname === item.href
                                    ? "bg-pink-50 text-pink-600"
                                    : "text-gray-500 hover:text-pink-600"
                                }`}
                              >
                                {item.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
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
            {howItWorksCategories.map((cat) => (
              <optgroup key={cat.title} label={`How It Works - ${cat.title}`}>
                {cat.items.map((item) => (
                  <option key={item.href} value={item.href}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
