import { RELATIVE_URLS } from "./index";

export const INTERNAL_LINKS = [
  {
    href: RELATIVE_URLS.INDEX,
    eventType: "home",
    text: "Home",
    category: "product",
  },
  // {
  //   href: RELATIVE_URLS.PROBLEM,
  //   eventType: "problem",
  //   text: "Problem",
  //   category: "product",
  // },
  {
    href: RELATIVE_URLS.HOW_IT_WORKS,
    eventType: "how_it_works",
    text: "Solution",
    category: "product",
  },
  {
    href: RELATIVE_URLS.USE_CASES,
    eventType: "use_cases",
    text: "Use Cases",
    category: "product",
  },
  // {
  //   href: RELATIVE_URLS.ADVANTAGES,
  //   eventType: "advantages",
  //   text: "Advantages",
  // },
  {
    href: RELATIVE_URLS.PRICING,
    eventType: "pricing",
    text: "Pricing",
    category: "product",
  },
  {
    href: RELATIVE_URLS.SETTINGS,
    eventType: "settings",
    text: "Settings",
    category: "product",
  },
  // {
  //   href: ABSOLUTE_URLS.GITHUB.SUPPORT,
  //   eventType: "support",
  //   text: "Support",
  // },
  {
    href: RELATIVE_URLS.BLOG,
    eventType: "blog",
    text: "Blog",
    category: "resources",
  },
  {
    href: RELATIVE_URLS.HOW_TO_GET_STARTED,
    eventType: "how_to_get_started",
    text: "How to Get Started",
    category: "resources",
  },
  {
    href: RELATIVE_URLS.FAQ,
    eventType: "faq",
    text: "FAQ",
    category: "resources",
  },
  {
    href: RELATIVE_URLS.PRIVACY_POLICY,
    eventType: "privacy_policy",
    text: "Privacy Policy",
    category: "legal",
  },
  {
    href: RELATIVE_URLS.TERMS_OF_SERVICE,
    eventType: "terms_of_service",
    text: "Terms of Service",
    category: "legal",
  },
] as const;

export type LinkCategory = "product" | "resources" | "legal";
