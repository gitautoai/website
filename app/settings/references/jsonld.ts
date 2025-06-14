import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Manage reference documentation and examples for GitAuto's test generation. Configure templates and coding standards.";

export const referencesJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.SETTINGS.REFERENCES + "#webpage",
  name: `${PRODUCT_NAME} References Settings`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.SETTINGS.REFERENCES,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Reference Documentation", description: DESCRIPTION },
};
