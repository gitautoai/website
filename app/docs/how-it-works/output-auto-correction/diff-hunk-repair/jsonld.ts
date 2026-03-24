import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto automatically repairs incorrect line counts in unified diff hunk headers, fixing one of the most common model failure modes.";

export const diffHunkRepairJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR + "#techarticle",
  name: `${PRODUCT_NAME} Diff Hunk Repair`,
  headline: `${PRODUCT_NAME} Diff Hunk Repair`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_HUNK_REPAIR,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "diff hunk repair",
    "unified diff",
    "hunk header",
    "line count correction",
    "git apply",
  ],
};
