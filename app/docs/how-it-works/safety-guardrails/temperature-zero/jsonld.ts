import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses temperature 0.0 for all LLM API calls to produce deterministic, consistent code output across every invocation.";

export const temperatureZeroJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO + "#techarticle",
  name: `${PRODUCT_NAME} Temperature Zero`,
  headline: `${PRODUCT_NAME} Temperature Zero`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.TEMPERATURE_ZERO,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "temperature zero",
    "deterministic output",
    "code generation",
    "safety guardrails",
    "AI consistency",
  ],
};
