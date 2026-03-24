import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto prevents infinite bot-to-bot conversation loops by checking if it already replied in a review thread.";

export const botLoopPreventionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION + "#techarticle",
  name: `${PRODUCT_NAME} Bot Loop Prevention`,
  headline: `${PRODUCT_NAME} Bot Loop Prevention`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.BOT_LOOP_PREVENTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "bot loop prevention",
    "review thread",
    "infinite loop",
    "safety guardrails",
    "bot interaction",
  ],
};
