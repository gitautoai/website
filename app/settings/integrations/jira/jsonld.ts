import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Connect GitAuto with Jira to assign GitAuto to your Jira issues and create GitHub pull requests for the issues.";

export const jiraIntegrationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.JIRA + "#webapplication",
  name: `${PRODUCT_NAME} Jira Integration`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.JIRA,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Connect Jira sites",
    "Link GitHub repositories",
    "Automated issue tracking",
    "Workflow integration",
  ],
  screenshot: THUMBNAILS.SETTINGS.INTEGRATIONS.JIRA,
  offers: OFFERS,
};
