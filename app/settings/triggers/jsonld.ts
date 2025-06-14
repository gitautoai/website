import { AUDIENCE, CREATOR } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure when GitAuto automatically creates unit test pull requests. Set up issue checkboxes, issue labels, dashboard triggers, commit triggers, merge triggers, and scheduled triggers.";

export const triggersJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.TRIGGERS + "#webpage",
  name: `${PRODUCT_NAME} Trigger Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.TRIGGERS,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Automated Testing Triggers", description: DESCRIPTION },
};
