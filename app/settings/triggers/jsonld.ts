import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure when GitAuto automatically creates unit test pull requests. Set up issue checkboxes, issue labels, dashboard triggers, commit triggers, merge triggers, and scheduled triggers.";

export const triggersJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.TRIGGERS + "#webapplication",
  name: `${PRODUCT_NAME} Trigger Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.TRIGGERS,
  creator: CREATOR,
  audience: AUDIENCE,
  applicationCategory: "DeveloperApplication",
  featureList: [
    "Review comment triggers",
    "Test failure handling",
    "Commit-based automation",
    "Scheduled test generation",
  ],
  screenshot: THUMBNAILS.SETTINGS.TRIGGERS,
  offers: OFFERS,
};
