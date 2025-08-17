import { RELATIVE_URLS } from "@/config/urls";

export const INTERNAL_LINKS = [
  {
    href: RELATIVE_URLS.INDEX,
    eventType: "home",
    text: "Home",
    category: "product",
    showInHeader: true,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.WHY_GITAUTO,
    eventType: "why_gitauto",
    text: "Why GitAuto",
    category: "product",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.WHAT_GITAUTO_DOES,
    eventType: "what_gitauto_does",
    text: "What GitAuto Does",
    category: "product",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.HOW_IT_WORKS,
    eventType: "how_it_works",
    text: "How It Works",
    category: "product",
    showInHeader: false,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.USE_CASES,
    eventType: "use_cases",
    text: "Use Cases",
    category: "product",
    showInHeader: false,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.HOW_TO_GET_STARTED,
    eventType: "how_to_get_started",
    text: "How to Get Started",
    category: "product",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.PRICING,
    eventType: "pricing",
    text: "Pricing",
    category: "product",
    showInHeader: true,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.PRICING_DETAILS,
    eventType: "pricing_details",
    text: "Pricing Details",
    category: "product",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.FAQ,
    eventType: "faq",
    text: "FAQ",
    category: "product",
    showInHeader: false,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.BLOG,
    eventType: "blog",
    text: "Blog",
    category: "resources",
    showInHeader: true,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.DASHBOARD.COVERAGE,
    eventType: "coverage_dashboard",
    text: "Dashboard",
    category: "resources",
    showInHeader: true,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.DASHBOARD.CHARTS,
    eventType: "charts_dashboard",
    text: "Charts",
    category: "resources",
    showInHeader: false,
    showInMobile: false,
  },
  {
    text: "Usage",
    href: RELATIVE_URLS.DASHBOARD.USAGE,
    eventType: "usage_click",
    category: "resources",
    showInHeader: false,
    showInMobile: false,
  },

  // Settings
  {
    href: RELATIVE_URLS.SETTINGS.TRIGGERS,
    eventType: "settings",
    text: "Settings",
    category: "resources",
    showInHeader: true,
    showInMobile: true,
  },
  {
    href: RELATIVE_URLS.SETTINGS.RULES,
    eventType: "rules",
    text: "Rules",
    category: "resources",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.SETTINGS.INTEGRATIONS.CIRCLECI,
    eventType: "circleci_integration",
    text: "CircleCI Integration",
    category: "resources",
    showInHeader: false,
    showInMobile: false,
  },

  // Documentation
  {
    href: RELATIVE_URLS.DOCS.GETTING_STARTED.INSTALLATION,
    eventType: "documentation",
    text: "Docs",
    category: "resources",
    showInHeader: true,
    showInMobile: true,
  },

  // Contact
  {
    href: RELATIVE_URLS.CONTACT,
    eventType: "contact",
    text: "Contact",
    category: "resources",
    showInHeader: true,
    showInMobile: true,
  },

  // Legal
  {
    href: RELATIVE_URLS.PRIVACY_POLICY,
    eventType: "privacy_policy",
    text: "Privacy Policy",
    category: "legal",
    showInHeader: false,
    showInMobile: false,
  },
  {
    href: RELATIVE_URLS.TERMS_OF_SERVICE,
    eventType: "terms_of_service",
    text: "Terms of Service",
    category: "legal",
    showInHeader: false,
    showInMobile: false,
  },
] as const;

export type LinkCategory = "product" | "resources" | "legal";
