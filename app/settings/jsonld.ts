import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/WebApplication
 */
export const settingsJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INDEX + "#webapplication",
  name: `${PRODUCT_NAME} Settings`,
  description:
    "Configure GitAuto settings for your repositories. Set up triggers, rules, integrations, and customize automated testing behavior.",
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INDEX,
  applicationCategory: "DeveloperApplication",
  applicationSubCategory: "Configuration Dashboard",
  operatingSystem: "All",
  browserRequirements: "Modern web browser with JavaScript enabled",
  creator: CREATOR,
  applicationSuite: "GitAuto QA Automation Platform",
  audience: AUDIENCE,
};
