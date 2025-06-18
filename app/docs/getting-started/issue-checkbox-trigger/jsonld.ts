import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const issueCheckboxTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER + "#howto",
  name: `How to Use ${PRODUCT_NAME} GitHub Issue Checkboxes`,
  description:
    "Generate tests by checking GitAuto checkbox in GitHub issues. Simple one-click test generation process.",
  url: ABSOLUTE_URLS.GITAUTO.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.GETTING_STARTED.ISSUE_CHECKBOX_TRIGGER,
  totalTime: "PT3M",
  step: [
    { "@type": "HowToStep", name: "Create GitHub issue", text: "Create new issue in repository" },
    {
      "@type": "HowToStep",
      name: "Check GitAuto checkbox",
      text: "Check checkbox in GitAuto comment",
    },
    { "@type": "HowToStep", name: "Review pull request", text: "Review and merge generated tests" },
  ],
  offers: OFFERS,
};
