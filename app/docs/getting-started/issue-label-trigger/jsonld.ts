import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Trigger GitAuto test generation using GitHub issue labels. Automated testing with label-based workflows.";

export const issueLabelTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} Issue Label Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_LABEL_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Issue Label Automation", description: DESCRIPTION },
  totalTime: "PT3M",
  supply: ["GitHub Issue", "Issue Labels", "Repository Access"],
};
