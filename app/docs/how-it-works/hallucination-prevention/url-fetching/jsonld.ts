import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto fetches full webpage content as markdown so the model can read documentation, API references, and changelogs before generating code.";

export const urlFetchingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING +
    "#techarticle",
  name: `${PRODUCT_NAME} URL Fetching`,
  headline: `${PRODUCT_NAME} URL Fetching`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.URL_FETCHING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "url fetching",
    "web scraping",
    "hallucination prevention",
    "documentation reading",
    "AI code generation",
  ],
};
