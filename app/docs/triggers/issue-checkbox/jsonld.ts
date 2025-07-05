import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to trigger GitAuto by checking a box in GitHub issues. The simplest way to request unit tests for specific files with contextual information.";

export const issueCheckboxTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_CHECKBOX + "#techarticle",
  headline: `${PRODUCT_NAME} Issue Checkbox Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_CHECKBOX,
  image: THUMBNAILS.DOCS.TRIGGERS.ISSUE_CHECKBOX,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "GitHub Issue Checkbox Automation",
    description: "Simple checkbox-based test generation trigger",
  },
  teaches: [
    "How to create GitHub issues for test requests",
    "Using GitAuto's automatic checkbox feature",
    "Providing context for better test generation",
    "Review and merge workflow for generated tests",
  ],
  offers: OFFERS,
};
