import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses Claude Sonnet 4.6 to summarize what it did, bugs found, and non-code tasks, and appends it to the PR body after completing work.";

export const prBodySummaryJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.PR_BODY_SUMMARY + "#techarticle",
  headline: `${PRODUCT_NAME} PR Body Summary`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.PR_BODY_SUMMARY,
  image: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "PR Body Summary",
    description: "AI work summaries appended to pull request bodies after agent completion",
  },
  teaches: [
    "How GitAuto summarizes its work in the PR body",
    "What sections are generated and when",
    "How idempotent upserts keep PR bodies clean",
  ],
  offers: OFFERS,
};
