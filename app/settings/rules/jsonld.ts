import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure GitAuto automation rules, file patterns, and testing preferences for your repositories.";

export const rulesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES + "#webpage",
  name: `${PRODUCT_NAME} Rules Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.RULES,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Automation Rules", description: DESCRIPTION },
};
