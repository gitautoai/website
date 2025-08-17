import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Connect CircleCI with GitAuto to automatically read build logs and analyze test failures. Configure Personal Access Tokens for seamless CI/CD integration and improved test generation.";

/**
 * @see https://schema.org/WebApplication
 */
export const circleCIJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.CIRCLECI + "#webapplication",
  name: `CircleCI Integration - ${PRODUCT_NAME}`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.CIRCLECI,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "CI/CD Integration",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  featureList: [
    "Store CircleCI Personal Access Tokens securely",
    "Configure tokens per GitHub organization",
    "Automatic build log retrieval on test failures",
    "Error message analysis for better test generation",
    "Token management with update and delete capabilities",
    "Visual token masking for security",
    "Direct link to CircleCI token generation",
    "Organization-level token association",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "Active GitAuto account and CircleCI account with API access",
  interactionService: {
    "@type": "WebSite",
    name: "CircleCI",
    url: "https://circleci.com",
    description: "Continuous Integration and Delivery platform",
  },
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.SETTINGS.INTEGRATIONS.CIRCLECI,
    description:
      "GitAuto CircleCI Integration settings showing token configuration and organization selector",
  },
  usageInfo: {
    "@type": "HowTo",
    name: "How to Connect CircleCI with GitAuto",
    description: "Configure CircleCI Personal Access Token to enable automatic build log analysis",
    step: [
      {
        "@type": "HowToStep",
        name: "Generate CircleCI Token",
        text: "Visit CircleCI settings and create a new Personal Access Token",
        url: "https://app.circleci.com/settings/user/tokens",
      },
      {
        "@type": "HowToStep",
        name: "Select Organization",
        text: "Choose the GitHub organization to associate with the token",
      },
      {
        "@type": "HowToStep",
        name: "Enter Token",
        text: "Paste your CircleCI Personal Access Token in the secure input field",
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
