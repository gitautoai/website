import Link from "next/link";
import { FaBook, FaChartBar, FaCog, FaCogs, FaPlug, FaRocket, FaShieldAlt } from "react-icons/fa";
import { RELATIVE_URLS } from "@/config/urls";

const sections = [
  {
    title: "Getting Started",
    items: [
      {
        href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
        icon: FaRocket,
        label: "Installation",
        description: "Install GitAuto GitHub App on your repositories",
      },
      {
        href: RELATIVE_URLS.DOCS.GETTING_STARTED.SETUP,
        icon: FaCog,
        label: "Setup",
        description: "Configure coverage reporting and initial settings",
      },
    ],
  },
  {
    title: "Triggers",
    items: [
      {
        href: RELATIVE_URLS.DOCS.TRIGGERS.OVERVIEW,
        icon: FaRocket,
        label: "Overview",
        description: "How GitAuto triggers test generation",
      },
      {
        href: RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE,
        icon: FaCog,
        label: "Schedule Trigger",
        description: "Automated daily/weekly test generation",
      },
      {
        href: RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE,
        icon: FaShieldAlt,
        label: "Test Failure Trigger",
        description: "Auto-fix failing tests in CI",
      },
      {
        href: RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT,
        icon: FaBook,
        label: "Review Comment Trigger",
        description: "Trigger via PR review comments",
      },
      {
        href: RELATIVE_URLS.DOCS.TRIGGERS.DASHBOARD,
        icon: FaChartBar,
        label: "Dashboard Trigger",
        description: "Trigger from the coverage dashboard",
      },
    ],
  },
  {
    title: "Coverage Dashboard",
    items: [
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.OVERVIEW,
        icon: FaChartBar,
        label: "Overview",
        description: "Understanding coverage reports and metrics",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.PYTHON,
        icon: FaBook,
        label: "Python",
        description: "pytest and coverage.py setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.JAVASCRIPT,
        icon: FaBook,
        label: "JavaScript",
        description: "Jest, Vitest, and Istanbul setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.JAVA,
        icon: FaBook,
        label: "Java",
        description: "JaCoCo and Maven/Gradle setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.GO,
        icon: FaBook,
        label: "Go",
        description: "go test coverage setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.PHP,
        icon: FaBook,
        label: "PHP",
        description: "PHPUnit coverage setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.RUBY,
        icon: FaBook,
        label: "Ruby",
        description: "SimpleCov coverage setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.FLUTTER,
        icon: FaBook,
        label: "Flutter",
        description: "Flutter test coverage setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.MULTI_LANGUAGE,
        icon: FaBook,
        label: "Multi-Language",
        description: "Monorepo and multi-language setup",
      },
      {
        href: RELATIVE_URLS.DOCS.COVERAGE.CHARTS,
        icon: FaChartBar,
        label: "Coverage Charts",
        description: "Visualize coverage trends over time",
      },
    ],
  },
  {
    title: "Customization",
    items: [
      {
        href: RELATIVE_URLS.DOCS.CUSTOMIZATION.REPOSITORY_RULES,
        icon: FaCogs,
        label: "Repository Rules",
        description: "Custom rules for test generation",
      },
      {
        href: RELATIVE_URLS.DOCS.CUSTOMIZATION.OUTPUT_LANGUAGE,
        icon: FaCog,
        label: "Output Language",
        description: "Set preferred language for generated content",
      },
      {
        href: RELATIVE_URLS.DOCS.CUSTOMIZATION.GITAUTO_MD,
        icon: FaBook,
        label: "GITAUTO.md",
        description: "Repository-level configuration file",
      },
    ],
  },
  {
    title: "Actions",
    items: [
      {
        href: RELATIVE_URLS.DOCS.ACTIONS.AUTO_MERGE,
        icon: FaCogs,
        label: "Auto-Merge",
        description: "Automatically merge PRs when checks pass",
      },
      {
        href: RELATIVE_URLS.DOCS.ACTIONS.PR_BODY_SUMMARY,
        icon: FaBook,
        label: "PR Body Summary",
        description: "AI-generated PR descriptions",
      },
      {
        href: RELATIVE_URLS.DOCS.ACTIONS.SIBLING_BRANCH_RETARGET,
        icon: FaCog,
        label: "Sibling Branch Retarget",
        description: "Auto-retarget PRs when target branch changes",
      },
    ],
  },
  {
    title: "Integrations",
    items: [
      {
        href: RELATIVE_URLS.DOCS.INTEGRATIONS.CIRCLECI,
        icon: FaPlug,
        label: "CircleCI",
        description: "Connect CircleCI for CI/CD integration",
      },
      {
        href: RELATIVE_URLS.DOCS.INTEGRATIONS.NPM,
        icon: FaPlug,
        label: "npm",
        description: "Connect npm for package management",
      },
    ],
  },
  {
    title: "How It Works",
    items: [
      {
        href: RELATIVE_URLS.DOCS.HOW_IT_WORKS.OVERVIEW,
        icon: FaCogs,
        label: "Overview",
        description: "Architecture and processing pipeline",
      },
    ],
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Documentation</h1>

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
