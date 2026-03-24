import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto restricts what can go into GITAUTO.md: only reusable, repo-specific learnings, preventing it from becoming a dumping ground.";

export const gitautoMdRestrictionsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS + "#techarticle",
  name: `${PRODUCT_NAME} GITAUTO.md Restrictions`,
  headline: `${PRODUCT_NAME} GITAUTO.md Restrictions`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION.GITAUTO_MD_RESTRICTIONS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.HALLUCINATION_PREVENTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "GITAUTO.md",
    "memory restrictions",
    "coding standards",
    "knowledge management",
    "AI code generation",
  ],
};
