import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto strips malformed XML fragments from the model's tool arguments, preventing JSON parsing failures that crash the agent loop.";

export const sanitizeToolArgumentsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS + "#techarticle",
  name: `${PRODUCT_NAME} Sanitize Tool Arguments`,
  headline: `${PRODUCT_NAME} Sanitize Tool Arguments`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.SANITIZE_TOOL_ARGUMENTS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "sanitize arguments",
    "XML fragments",
    "JSON parsing",
    "agent loop",
    "tool argument cleaning",
  ],
};
