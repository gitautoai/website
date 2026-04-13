import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto routes file queries through Claude Haiku so only the answer enters the main model's context, reducing input token costs for pattern learning.";

export const fileQueryRoutingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.FILE_QUERY_ROUTING +
    "#techarticle",
  name: `${PRODUCT_NAME} File Query Routing`,
  headline: `${PRODUCT_NAME} File Query Routing`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.FILE_QUERY_ROUTING,
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
    "file reading",
    "AI agents",
  ],
};
