import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto detects the dominant test naming convention in your repo and instructs the model to follow it consistently.";

export const testNamingDetectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION +
    "#techarticle",
  name: `${PRODUCT_NAME} Test Naming Detection`,
  headline: `${PRODUCT_NAME} Test Naming Detection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.TEST_NAMING_DETECTION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "test naming convention",
    "naming detection",
    "test file naming",
    "spec vs test",
    "consistent naming",
  ],
};
