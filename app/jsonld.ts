import { PRODUCT_NAME, EMAIL, DESCRIPTION, LEGAL_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/Organization
 */
export const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ABSOLUTE_URLS.GITAUTO.INDEX + "#organization",
  name: PRODUCT_NAME,
  alternateName: LEGAL_NAME,
  legalName: LEGAL_NAME,
  url: ABSOLUTE_URLS.GITAUTO.INDEX,
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
  "@id": ABSOLUTE_URLS.GITAUTO.INDEX + "#organization",
  name: PRODUCT_NAME,
  url: ABSOLUTE_URLS.GITAUTO.INDEX,
} as const;

export const OFFERS = [
  {
    "@type": "Offer",
    name: "Free Plan",
    price: "0",
    priceCurrency: "USD",
    description: "3 PRs per month per GitHub organization",
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
  {
    "@type": "Offer",
    name: "Standard Plan - Monthly",
    price: "100",
    priceCurrency: "USD",
    description: "20 PRs per month per GitHub organization",
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
  {
    "@type": "Offer",
    name: "Standard Plan - Yearly",
    price: "1000",
    priceCurrency: "USD",
    description: "240 PRs per year per GitHub organization (Save $200/year)",
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
  {
    "@type": "Offer",
    name: "Enterprise Plan - Monthly",
    price: "500+",
    priceCurrency: "USD",
    description: "200+ PRs per month per GitHub organization with custom features",
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  },
  {
    "@type": "Offer",
    name: "Enterprise Plan - Yearly",
    price: "5000+",
    priceCurrency: "USD",
    description:
      "2400+ PRs per year per GitHub organization with custom features (Save $1,000/year)",
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
  "@id": ABSOLUTE_URLS.GITAUTO.INDEX + "#softwareapplication",
  name: PRODUCT_NAME,
  operatingSystem: "All",
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Unit Test Generator",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.INDEX,
  offers: OFFERS,
  creator: CREATOR,
  featureList:
    "Generates unit test pull requests, Runs tests and fixes failures, Triggered by issue, PR comment, commit, merge, or schedule, No manual test writing needed",
  inLanguage: "en",
  applicationSuite: "GitHub QA Automation",
};
