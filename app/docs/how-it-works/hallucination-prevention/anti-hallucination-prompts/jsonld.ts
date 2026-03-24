import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses system message instructions to explicitly tell the model to never claim a file exists unless verified, preventing hallucinated imports and references.";

export const antiHallucinationPromptsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS + "#techarticle",
  name: `${PRODUCT_NAME} Anti-Hallucination Prompts`,
  headline: `${PRODUCT_NAME} Anti-Hallucination Prompts`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.ANTI_HALLUCINATION_PROMPTS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "anti-hallucination",
    "system prompts",
    "file verification",
    "import validation",
    "AI code generation",
  ],
};
