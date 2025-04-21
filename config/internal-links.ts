import { RELATIVE_URLS } from "./index";

export const INTERNAL_LINKS = [
  {
    href: RELATIVE_URLS.INDEX,
    eventType: "home",
    text: "Home",
    category: "product",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.HOW_IT_WORKS,
    eventType: "how_it_works",
    text: "Solution",
    category: "product",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.BLOG,
    eventType: "blog",
    text: "Blog",
    category: "resources",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.HOW_TO_GET_STARTED,
    eventType: "how_to_get_started",
    text: "How to Get Started",
    category: "resources",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.PRICING,
    eventType: "pricing",
    text: "Pricing",
    category: "product",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.COVERAGES,
    eventType: "coverage_dashboard",
    text: "Dashboard",
    category: "product",
    showInNav: true,
  },
  {
    text: "Usage",
    href: "/dashboard/usage",
    eventType: "usage_click",
    category: "product",
    showInNav: false,
  },
  {
    href: RELATIVE_URLS.SETTINGS,
    eventType: "settings",
    text: "Settings",
    category: "product",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.DOCS,
    eventType: "documentation",
    text: "Docs",
    category: "resources",
    showInNav: true,
  },
  {
    href: RELATIVE_URLS.FAQ,
    eventType: "faq",
    text: "FAQ",
    category: "resources",
    showInNav: false,
  },
  {
    href: RELATIVE_URLS.PRIVACY_POLICY,
    eventType: "privacy_policy",
    text: "Privacy Policy",
    category: "legal",
    showInNav: false,
  },
  {
    href: RELATIVE_URLS.TERMS_OF_SERVICE,
    eventType: "terms_of_service",
    text: "Terms of Service",
    category: "legal",
    showInNav: false,
  },
] as const;

export type LinkCategory = "product" | "resources" | "legal";
