import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto replaces older file read contents with placeholders when the same file has been read multiple times, keeping only the most recent version.";

export const staleFileReplacementJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT + "#techarticle",
  name: `${PRODUCT_NAME} Stale File Replacement`,
  headline: `${PRODUCT_NAME} Stale File Replacement`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.STALE_FILE_REPLACEMENT,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "stale file replacement",
    "token optimization",
    "file deduplication",
    "context management",
    "AI code generation",
  ],
};
