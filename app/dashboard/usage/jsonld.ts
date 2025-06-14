import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "View your GitAuto usage statistics including pull requests generated, issues processed, and billing cycle information.";
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

export const usageJsonLd = {
  "@context": "https://schema.org",
  "@type": "Dataset",
  "@id": ABSOLUTE_URLS.GITAUTO.USAGE + "#dataset",
  name: `${PRODUCT_NAME} Usage Statistics`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.USAGE,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Usage Analytics", description: DESCRIPTION },
  variableMeasured: VARIABLE_MEASURED,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Usage Analytics Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  applicationSuite: "GitAuto QA Automation Platform",
  offers: OFFERS,
  mainEntity: {
    "@type": "Dataset",
    name: "Usage Analytics Data",
    description: DESCRIPTION,
    variableMeasured: VARIABLE_MEASURED,
  },
};
