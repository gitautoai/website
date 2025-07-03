import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Track and monitor your GitAuto usage statistics including pull requests generated, issues processed, billing cycle information, and credit management.";
const VARIABLE_MEASURED = [
  "Total Pull Requests",
  "Total Issues",
  "Total Merged PRs",
  "User Pull Requests",
  "User Issues",
  "User Merged PRs",
  "Billing Cycle Usage",
  "Request Limits",
];

/**
 * @see https://schema.org/WebApplication
 */
export const usageJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.DASHBOARD.USAGE + "#webapplication",
  name: `${PRODUCT_NAME} Usage Dashboard`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.USAGE,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Usage Analytics Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  featureList: [
    "View usage statistics across all repositories",
    "Track pull requests and issues generated",
    "Monitor billing cycle usage and limits",
    "Manage credits and subscription",
    "Compare all-time vs current cycle metrics",
    "Access Stripe customer portal",
  ],
  applicationSuite: "GitAuto QA Automation Platform",
  softwareRequirements: "Active GitAuto subscription",
  screenshot: {
    "@type": "ImageObject",
    url: THUMBNAILS.DASHBOARD.USAGE,
    description:
      "GitAuto Usage Dashboard interface showing usage statistics and billing information",
  },
  offers: OFFERS,
  usageInfo: {
    "@type": "CreativeWork",
    name: "Usage Dashboard Usage",
    description:
      "Monitor your GitAuto usage statistics, track billing cycles, and manage credits through integrated Stripe portal",
  },
  mainEntity: {
    "@type": "Dataset",
    name: "Usage Analytics Data",
    description: "Aggregated usage statistics from GitAuto automation activities",
    variableMeasured: VARIABLE_MEASURED,
    measurementTechnique: "Automated tracking of GitAuto activities and Stripe billing data",
  },
};
