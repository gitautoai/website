import { RELATIVE_URLS } from "@/config";

export const INTERNAL_LINKS = [
  {
    href: RELATIVE_URLS.INDEX,
    eventType: "home",
    text: "Home",
  },
  {
    href: RELATIVE_URLS.PROBLEM,
    eventType: "problem",
    text: "Problem",
  },
  {
    href: RELATIVE_URLS.HOW_IT_WORKS,
    eventType: "how_it_works",
    text: "Solution",
  },
  {
    href: RELATIVE_URLS.USE_CASES,
    eventType: "use_cases",
    text: "Use Cases",
  },
  // {
  //   href: RELATIVE_URLS.ADVANTAGES,
  //   eventType: "advantages",
  //   text: "Advantages",
  // },
  {
    href: RELATIVE_URLS.HOW_TO_GET_STARTED,
    eventType: "how_to_get_started",
    text: "How to Get Started",
  },
  {
    href: RELATIVE_URLS.PRICING,
    eventType: "pricing",
    text: "Pricing",
  },
  // {
  //   href: ABSOLUTE_URLS.GITHUB.SUPPORT,
  //   eventType: "support",
  //   text: "Support",
  // },
  {
    href: RELATIVE_URLS.FAQ,
    eventType: "faq",
    text: "FAQ",
  },
  {
    href: RELATIVE_URLS.PRIVACY_POLICY,
    eventType: "privacy_policy",
    text: "Privacy Policy",
  },
  {
    href: RELATIVE_URLS.TERMS_OF_SERVICE,
    eventType: "terms_of_service",
    text: "Terms of Service",
  },
] as const;
