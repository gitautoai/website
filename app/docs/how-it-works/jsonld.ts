import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Explore 50+ techniques GitAuto uses across 7 categories to generate high-quality unit tests - from context enrichment to hallucination prevention.";

export const howItWorksJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OVERVIEW + "#techarticle",
  name: `${PRODUCT_NAME} How It Works`,
  headline: "How It Works - 50+ Techniques for Reliable Test Generation",
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OVERVIEW,
  author: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "SoftwareApplication",
    name: PRODUCT_NAME,
    applicationCategory: "DeveloperApplication",
  },
  teaches: [
    "Context enrichment techniques",
    "Output auto-correction methods",
    "Quality verification checks",
    "Safety guardrails",
    "Token and cost management",
    "Resilience and recovery strategies",
    "Hallucination prevention techniques",
  ],
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.INDEX,
  publisher: CREATOR,
  offers: OFFERS,
};
