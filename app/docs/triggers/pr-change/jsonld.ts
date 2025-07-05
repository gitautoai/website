import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure GitAuto's PR Change Trigger to automatically add unit tests when PRs are created. Ideal for coverage requirements.";

export const prChangeJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_CHANGE + "#techarticle",
  name: `${PRODUCT_NAME} PR Change Trigger Documentation`,
  headline: "PR Change Trigger - Automated Testing on PR Updates",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_CHANGE,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  teaches: [
    "How to configure PR Change Trigger",
    "Coverage-gated workflow setup",
    "Safety considerations and rollback",
    "AWS coverage requirements example",
  ],
  image: THUMBNAILS.DOCS.TRIGGERS.PR_CHANGE,
  publisher: CREATOR,
  offers: OFFERS,
};
