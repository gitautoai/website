import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto gives the AI agent a forget_messages tool to explicitly drop stale file contents from its own context window, reducing accumulated input token costs across long runs.";

export const contextForgettingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id":
    ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CONTEXT_FORGETTING +
    "#techarticle",
  name: `${PRODUCT_NAME} Context Forgetting`,
  headline: `${PRODUCT_NAME} Context Forgetting`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.CONTEXT_FORGETTING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "context window",
    "token optimization",
    "cost reduction",
    "AI agents",
    "memory management",
  ],
};
