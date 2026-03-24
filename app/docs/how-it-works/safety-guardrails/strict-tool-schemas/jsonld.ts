import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto enforces strict JSON schemas on all tool definitions to prevent the model from hallucinating extra fields or using wrong types.";

export const strictToolSchemasJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS + "#techarticle",
  name: `${PRODUCT_NAME} Strict Tool Schemas`,
  headline: `${PRODUCT_NAME} Strict Tool Schemas`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.STRICT_TOOL_SCHEMAS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "strict tool schemas",
    "JSON schema validation",
    "tool definitions",
    "safety guardrails",
    "API validation",
  ],
};
