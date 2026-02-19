import { PRODUCT_NAME, EMAIL, DESCRIPTION, LEGAL_NAME } from "@/config";
import { CREDIT_PRICING, FREE_CREDITS_AMOUNT_USD, FREE_PRS_LIMIT } from "@/config/pricing";
import { BASE_URL, ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/Organization
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": BASE_URL + "#organization",
  name: PRODUCT_NAME,
  alternateName: LEGAL_NAME,
  legalName: LEGAL_NAME,
  url: BASE_URL,
  logo: { "@type": "ImageObject", url: ABSOLUTE_URLS.GITAUTO.LOGO },
  founder: {
    "@type": "Person",
    name: "Wes Nishio",
    url: "https://github.com/hiroshinishio",
  },
  foundingDate: "2024-05-10",
  foundingLocation: {
    "@type": "Place",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dover",
      addressRegion: "DE",
      addressCountry: "US",
    },
  },
  address: {
    "@type": "PostalAddress",
    streetAddress: "214 Homer Ave",
    addressLocality: "Palo Alto",
    addressRegion: "CA",
    postalCode: "94301",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    email: EMAIL,
    contactType: "Customer Support",
    availableLanguage: ["English", "Japanese"],
    areaServed: "Worldwide",
  },
  sameAs: [
    ABSOLUTE_URLS.GITHUB.ORGANIZATION,
    ABSOLUTE_URLS.GITHUB.MARKETPLACE,
    ABSOLUTE_URLS.LINKEDIN,
    ABSOLUTE_URLS.TWITTER,
    ABSOLUTE_URLS.YOUTUBE.HOME,
  ],
};

export const CREATOR = {
  "@type": "Organization",
  "@id": BASE_URL + "#organization",
  name: PRODUCT_NAME,
  url: BASE_URL,
} as const;

export const OFFERS = [
  {
    "@type": "Offer",
    name: "Free Trial",
    price: "0",
    priceCurrency: "USD",
    description: `$${FREE_CREDITS_AMOUNT_USD} free credits (~${FREE_PRS_LIMIT} PRs) per GitHub organization`,
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
  {
    "@type": "Offer",
    name: "Paid",
    price: CREDIT_PRICING.PER_PR.AMOUNT_USD.toString(),
    priceCurrency: "USD",
    description: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR with $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD} minimum purchase`,
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
] as const;

export const AUDIENCE = {
  "@type": "Audience",
  audienceType: "Software Developers and QA Engineers",
  geographicArea: {
    "@type": "AdministrativeArea",
    name: "Worldwide",
  },
} as const;

/**
 * @see https://schema.org/SoftwareApplication
 */
export const softwareApplicationData = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": BASE_URL + "#softwareapplication",
  name: PRODUCT_NAME,
  operatingSystem: "All",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Unit Test Generator",
  description: DESCRIPTION,
  url: BASE_URL,
  offers: OFFERS,
  creator: CREATOR,
  featureList:
    "Generates unit test pull requests, Runs tests and fixes failures, Triggered by issue, PR comment, commit, merge, or schedule, No manual test writing needed",
  inLanguage: "en",
  applicationSuite: "GitHub QA Automation",
};
