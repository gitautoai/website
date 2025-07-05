import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to trigger GitAuto by adding the 'gitauto' label to GitHub issues. Perfect for automation workflows, APIs, and existing issue management.";

export const issueLabelTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_LABEL + "#techarticle",
  headline: `${PRODUCT_NAME} Issue Label Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.ISSUE_LABEL,
  image: THUMBNAILS.DOCS.TRIGGERS.ISSUE_LABEL,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "GitHub Label-based Automation",
    description: "API-friendly label-based test generation trigger",
  },
  teaches: [
    "How to add the 'gitauto' label to issues",
    "Working with existing issues",
    "API and GitHub Actions integration",
    "Automated workflow setup",
  ],
  offers: OFFERS,
};
