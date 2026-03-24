import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto checks if the PR is still open and the branch still exists before each iteration to avoid wasted work.";

export const prBranchChecksJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS + "#techarticle",
  name: `${PRODUCT_NAME} PR/Branch Checks`,
  headline: `${PRODUCT_NAME} PR/Branch Checks`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.PR_BRANCH_CHECKS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "PR checks",
    "branch checks",
    "stale target detection",
    "safety guardrails",
    "GitHub API",
  ],
};
