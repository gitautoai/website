import { RELATIVE_URLS } from "@/config/urls";

export const menuItems = [
  { id: "dashboard-header", label: "Dashboard", href: "#", isHeader: true },
  { id: "overview", label: "Overview", href: RELATIVE_URLS.DASHBOARD.INDEX, isHeader: false },
  {
    id: "coverage-trends",
    label: "Coverage Trends",
    href: RELATIVE_URLS.DASHBOARD.COVERAGE_TRENDS,
    isHeader: false,
  },
  {
    id: "file-coverage",
    label: "File Coverage",
    href: RELATIVE_URLS.DASHBOARD.FILE_COVERAGE,
    isHeader: false,
  },
  { id: "usage", label: "Usage", href: RELATIVE_URLS.DASHBOARD.USAGE, isHeader: false },
  { id: "credits", label: "Credits", href: RELATIVE_URLS.DASHBOARD.CREDITS, isHeader: false },
  { id: "prs", label: "Pull Requests", href: RELATIVE_URLS.DASHBOARD.PRS, isHeader: false },
  { id: "settings-header", label: "Settings", href: "#", isHeader: true },
  { id: "general", label: "General", href: RELATIVE_URLS.DASHBOARD.GENERAL, isHeader: false },
  { id: "triggers", label: "Triggers", href: RELATIVE_URLS.DASHBOARD.TRIGGERS, isHeader: false },
  { id: "rules", label: "Rules", href: RELATIVE_URLS.DASHBOARD.RULES, isHeader: false },
  {
    id: "references",
    label: "References",
    href: RELATIVE_URLS.DASHBOARD.REFERENCES,
    isHeader: false,
  },
  { id: "actions", label: "Actions", href: RELATIVE_URLS.DASHBOARD.ACTIONS, isHeader: false },
  { id: "integrations-header", label: "Integrations", href: "#", isHeader: true },
  {
    id: "circleci",
    label: "CircleCI",
    href: RELATIVE_URLS.DASHBOARD.INTEGRATIONS.CIRCLECI,
    isHeader: false,
  },
  {
    id: "npm",
    label: "npm",
    href: RELATIVE_URLS.DASHBOARD.INTEGRATIONS.NPM,
    isHeader: false,
  },
  { id: "home", label: "Back to Home", href: RELATIVE_URLS.INDEX, isHeader: false },
] as const;
