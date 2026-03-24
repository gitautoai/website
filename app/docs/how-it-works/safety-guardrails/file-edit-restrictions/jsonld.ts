import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto restricts file edits to test files by default, preventing the model from modifying production source code while generating tests.";

export const fileEditRestrictionsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS + "#techarticle",
  name: `${PRODUCT_NAME} File Edit Restrictions`,
  headline: `${PRODUCT_NAME} File Edit Restrictions`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS.FILE_EDIT_RESTRICTIONS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.SAFETY_GUARDRAILS,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "file edit restrictions",
    "source code protection",
    "test file editing",
    "safety guardrails",
    "AI code generation",
  ],
};
