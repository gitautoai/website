import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Connect GitAuto with Jira to assign GitAuto to your Jira issues and create GitHub pull requests for the issues.";

export const jiraIntegrationJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.JIRA + "#webpage",
  name: `${PRODUCT_NAME} Jira Integration`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.INTEGRATIONS.JIRA,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Jira Integration", description: DESCRIPTION },
};
