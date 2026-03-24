import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto detects when the model passes arguments meant for one tool to another and automatically swaps the tool name to match.";

export const toolArgumentCorrectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION + "#techarticle",
  name: `${PRODUCT_NAME} Tool Argument Correction`,
  headline: `${PRODUCT_NAME} Tool Argument Correction`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.TOOL_ARGUMENT_CORRECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "tool argument correction",
    "argument mismatch",
    "tool swap",
    "agent loop",
    "AI error recovery",
  ],
};
