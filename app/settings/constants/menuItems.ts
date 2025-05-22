export const menuItems = [
  { id: "dashboard-header", label: "Dashboard", href: "#", isHeader: true },
  { id: "coverage", label: "Coverage", href: "/dashboard/coverage", isHeader: false },
  { id: "usage", label: "Usage", href: "/dashboard/usage", isHeader: false },
  { id: "settings-header", label: "Settings", href: "#", isHeader: true },
  { id: "general", label: "General", href: "/settings", isHeader: false },
  { id: "triggers", label: "Triggers", href: "/settings/triggers", isHeader: false },
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
