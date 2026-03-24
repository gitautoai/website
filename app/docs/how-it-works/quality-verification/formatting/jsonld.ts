import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto runs the project's code formatter on generated code before committing to prevent PR failures from style violations.";

export const formattingJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING + "#techarticle",
  name: `${PRODUCT_NAME} Formatting`,
  headline: `${PRODUCT_NAME} Formatting`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.FORMATTING,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "prettier",
    "code formatting",
    "prettierrc",
    "quality verification",
    "AI code generation",
  ],
};
