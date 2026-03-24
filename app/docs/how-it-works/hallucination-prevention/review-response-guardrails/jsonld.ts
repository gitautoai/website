import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto instructs the model to think critically about review comments instead of blindly agreeing, preventing sycophantic responses that break code.";

export const reviewResponseGuardrailsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS + "#techarticle",
  name: `${PRODUCT_NAME} Review Response Guardrails`,
  headline: `${PRODUCT_NAME} Review Response Guardrails`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.REVIEW_RESPONSE_GUARDRAILS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "review response",
    "sycophancy prevention",
    "critical thinking",
    "code review",
    "AI code generation",
  ],
};
