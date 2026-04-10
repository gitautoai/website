import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto uses Claude Haiku as a summarization layer to filter web page content before passing it to the main reasoning model, reducing token costs by ~80%.";

export const webFetchSummarizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION +
    "#techarticle",
  name: `${PRODUCT_NAME} Web Fetch Summarization`,
  headline: `${PRODUCT_NAME} Web Fetch Summarization`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.WEB_FETCH_SUMMARIZATION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "token optimization",
    "cost reduction",
    "model routing",
    "Claude Haiku",
    "web fetching",
    "AI agents",
  ],
};
