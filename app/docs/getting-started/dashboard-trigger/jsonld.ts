import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Trigger GitAuto test generation directly from the dashboard. Manual control over automated test creation.";

export const dashboardTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} Dashboard Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.DASHBOARD_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Dashboard Automation", description: DESCRIPTION },
  totalTime: "PT1M",
  supply: ["GitAuto Dashboard Access", "Repository Selection"],
};
