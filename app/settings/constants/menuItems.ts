import { RELATIVE_URLS } from "@/config/urls";

export const menuItems = [
  { id: "dashboard-header", label: "Dashboard", href: "#", isHeader: true },
  { id: "coverage", label: "Coverage", href: RELATIVE_URLS.DASHBOARD.COVERAGE, isHeader: false },
  { id: "charts", label: "Charts", href: RELATIVE_URLS.DASHBOARD.CHARTS, isHeader: false },
  { id: "usage", label: "Usage", href: RELATIVE_URLS.DASHBOARD.USAGE, isHeader: false },
  { id: "credits", label: "Credits", href: RELATIVE_URLS.DASHBOARD.CREDITS, isHeader: false },
  { id: "settings-header", label: "Settings", href: "#", isHeader: true },
  { id: "general", label: "General", href: RELATIVE_URLS.SETTINGS.INDEX, isHeader: false },
  { id: "triggers", label: "Triggers", href: RELATIVE_URLS.SETTINGS.TRIGGERS, isHeader: false },
  { id: "rules", label: "Rules", href: RELATIVE_URLS.SETTINGS.RULES, isHeader: false },
  {
    id: "references",
    label: "References",
    href: RELATIVE_URLS.SETTINGS.REFERENCES,
    isHeader: false,
  },
  // {
  //   id: "screenshots",
  //   label: "Screenshots",
  //   href: RELATIVE_URLS.SETTINGS.SCREENSHOTS,
  //   isHeader: false,
  // },
  // {
  //   id: "integrations",
  //   label: "Integrations",
  //   href: RELATIVE_URLS.SETTINGS.INTEGRATIONS.JIRA,
  //   isHeader: false,
  // },
  { id: "home", label: "Back to Home", href: RELATIVE_URLS.INDEX, isHeader: false },
] as const;
