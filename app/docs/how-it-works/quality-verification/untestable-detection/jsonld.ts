import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses the AI model to evaluate whether uncovered code is genuinely untestable or should be removed, preventing wasted iterations on unreachable code.";

export const untestableDetectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION + "#techarticle",
  name: `${PRODUCT_NAME} Untestable Detection`,
  headline: `${PRODUCT_NAME} Untestable Detection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.UNTESTABLE_DETECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "untestable code",
    "code analysis",
    "dead code",
    "coverage optimization",
    "quality verification",
  ],
};
