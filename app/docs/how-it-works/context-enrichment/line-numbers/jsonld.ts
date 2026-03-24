import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto adds right-aligned line numbers to file content, enabling the model to reference specific lines for precise diff application.";

export const lineNumbersJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS + "#techarticle",
  name: `${PRODUCT_NAME} Line Numbers`,
  headline: `${PRODUCT_NAME} Line Numbers`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT.LINE_NUMBERS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.CONTEXT_ENRICHMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "line numbers",
    "code formatting",
    "diff application",
    "context enrichment",
    "AI code generation",
  ],
};
