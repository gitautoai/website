import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto loads different XML prompt files depending on the trigger type, providing specialized instructions for each scenario.";

export const triggerSpecificPromptsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS +
    "#techarticle",
  name: `${PRODUCT_NAME} Trigger-Specific Prompts`,
  headline: `${PRODUCT_NAME} Trigger-Specific Prompts`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TRIGGER_SPECIFIC_PROMPTS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "trigger-specific prompts",
    "prompt engineering",
    "XML prompts",
    "context-aware instructions",
    "AI code generation",
  ],
};
