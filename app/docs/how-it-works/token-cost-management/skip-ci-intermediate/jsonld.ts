import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto adds [skip ci] to intermediate commit messages to prevent CI from running on every commit during an agent session.";

export const skipCiIntermediateJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE + "#techarticle",
  name: `${PRODUCT_NAME} Skip CI Intermediate`,
  headline: `${PRODUCT_NAME} Skip CI Intermediate`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.SKIP_CI_INTERMEDIATE,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "skip ci",
    "CI optimization",
    "intermediate commits",
    "cost reduction",
    "AI code generation",
  ],
};
