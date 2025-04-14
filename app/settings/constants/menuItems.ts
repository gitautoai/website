export const menuItems = [
  { id: "dashboard-header", label: "Dashboard", href: "#", isHeader: true },
  { id: "coverage", label: "Coverage", href: "/dashboard/coverage", isHeader: false },
  { id: "settings-header", label: "Settings", href: "#", isHeader: true },
  { id: "general", label: "General", href: "/settings", isHeader: false },
  { id: "rules", label: "Rules", href: "/settings/rules", isHeader: false },
  { id: "references", label: "References", href: "/settings/references", isHeader: false },
  { id: "screenshots", label: "Screenshots", href: "/settings/screenshots", isHeader: false },
  {
    id: "integrations",
    label: "Integrations",
    href: "/settings/integrations/jira",
    isHeader: false,
  },
  { id: "home", label: "Back to Home", href: "/", isHeader: false },
] as const;
