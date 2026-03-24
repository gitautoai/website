import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto forces a verification run (formatting, linting, type checking, tests) as a final step when the agent loop exhausts all iterations without completing verification.";

export const forcedVerificationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION + "#techarticle",
  name: `${PRODUCT_NAME} Forced Verification`,
  headline: `${PRODUCT_NAME} Forced Verification`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY.FORCED_VERIFICATION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.RESILIENCE_RECOVERY,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "forced verification",
    "quality checks",
    "formatting",
    "linting",
    "AI code generation",
  ],
};
