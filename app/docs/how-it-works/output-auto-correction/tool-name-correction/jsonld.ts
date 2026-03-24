import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto auto-corrects when the model calls non-existent tool names by mapping hallucinated names to real tools in the agent loop.";

export const toolNameCorrectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION + "#techarticle",
  name: `${PRODUCT_NAME} Tool Name Correction`,
  headline: `${PRODUCT_NAME} Tool Name Correction`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_NAME_CORRECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "tool name correction",
    "hallucinated tool names",
    "agent loop",
    "tool mapping",
    "AI error recovery",
  ],
};
