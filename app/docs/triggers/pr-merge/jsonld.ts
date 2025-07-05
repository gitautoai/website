import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure GitAuto's PR Merge Trigger to create separate test PRs after merge. Safer approach with clean separation of concerns.";

export const prMergeJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_MERGE + "#techarticle",
  name: `${PRODUCT_NAME} PR Merge Trigger Documentation`,
  headline: "PR Merge Trigger - Automated Testing After Merge",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.PR_MERGE,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  teaches: [
    "How to configure PR Merge Trigger",
    "Benefits of separate test PRs",
    "Production workflow best practices",
    "Comparison with PR Change Trigger",
  ],
  image: THUMBNAILS.DOCS.TRIGGERS.PR_MERGE,
  publisher: CREATOR,
  offers: OFFERS,
};
