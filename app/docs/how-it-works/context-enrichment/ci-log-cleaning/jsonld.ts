import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto cleans CI logs by removing noise, deduplicating warnings, stripping ANSI codes, and minimizing verbosity before feeding them to the model.";

export const ciLogCleaningJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING + "#techarticle",
  name: `${PRODUCT_NAME} CI Log Cleaning`,
  headline: `${PRODUCT_NAME} CI Log Cleaning`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.CI_LOG_CLEANING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "CI log cleaning",
    "ANSI escape codes",
    "log deduplication",
    "CI/CD noise reduction",
    "token optimization",
  ],
};
