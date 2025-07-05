import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how to use GitHub review comments to request fixes on GitAuto-created pull requests. Collaborate with AI using familiar review workflows.";

export const reviewCommentTriggerJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.REVIEW_COMMENT + "#techarticle",
  headline: `${PRODUCT_NAME} Review Comment Trigger`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.TRIGGERS.REVIEW_COMMENT,
  image: THUMBNAILS.DOCS.TRIGGERS.REVIEW_COMMENT,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "GitHub Review Comments",
    description: "Using review comments to request automated code fixes",
  },
  teaches: [
    "How to enable review comment triggers",
    "Requesting changes on GitAuto PRs",
    "Getting automatic fix commits",
    "Iterative improvement workflow",
  ],
  offers: OFFERS,
};
