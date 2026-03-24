import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto runs static type checking on generated code to catch type errors before committing, saving reviewer time.";

export const typeCheckingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING + "#techarticle",
  name: `${PRODUCT_NAME} Type Checking`,
  headline: `${PRODUCT_NAME} Type Checking`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.TYPE_CHECKING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: ["typescript", "type checking", "tsc", "tsconfig", "quality verification"],
};
