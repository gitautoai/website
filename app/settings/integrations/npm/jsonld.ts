import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Connect npm with GitAuto to access private packages during test generation. Configure Access Tokens for seamless package installation and improved test coverage.";

/**
 * @see https://schema.org/WebApplication
 */
export const npmJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.NPM + "#webapplication",
  name: `npm Integration - ${PRODUCT_NAME}`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.NPM,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Package Registry Integration",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  featureList: [
    "Store npm Access Tokens securely",
    "Configure tokens per GitHub organization",
    "Automatic private package access during test generation",
    "Seamless integration with npm registry",
    "Token management with update and delete capabilities",
    "Visual token masking for security",
    "Direct link to npm token generation",
    "Organization-level token association",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "Active GitAuto account and npm account with API access",
  interactionService: {
    "@type": "WebSite",
    name: "npm",
    url: "https://www.npmjs.com",
    description: "Node Package Manager and registry",
  },
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.SETTINGS.INTEGRATIONS.NPM,
    description:
      "GitAuto npm Integration settings showing token configuration and organization selector",
  },
  usageInfo: {
    "@type": "HowTo",
    name: "How to Connect npm with GitAuto",
    description:
      "Configure npm Access Token to enable private package access during test generation",
    step: [
      {
        "@type": "HowToStep",
        name: "Generate npm Token",
        text: "Visit npm settings and create a new Access Token",
        url: "https://www.npmjs.com/settings/~/tokens",
      },
      {
        "@type": "HowToStep",
        name: "Select Organization",
        text: "Choose the GitHub organization to associate with the token",
      },
      {
        "@type": "HowToStep",
        name: "Enter Token",
        text: "Paste your npm Access Token in the secure input field",
      },
      {
        "@type": "HowToStep",
        name: "Save Configuration",
        text: "Click Save to store the token securely for your organization",
      },
    ],
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "150",
    bestRating: "5",
    worstRating: "1",
  },
};
