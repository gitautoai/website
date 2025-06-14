import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to trigger GitAuto test generation using GitHub issue checkboxes. Simple checkbox-based automation.";

export const issueCheckboxTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} Issue Checkbox Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  about: { "@type": "Thing", name: "Issue Checkbox Automation", description: DESCRIPTION },
  totalTime: "PT2M",
  supply: ["GitHub Issue", "Repository Access"],
};
