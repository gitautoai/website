import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto removes old diff attempts for files that were edited again in later iterations, keeping only the latest apply_diff_to_file attempt per file.";

export const outdatedDiffRemovalJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL + "#techarticle",
  name: `${PRODUCT_NAME} Outdated Diff Removal`,
  headline: `${PRODUCT_NAME} Outdated Diff Removal`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT.OUTDATED_DIFF_REMOVAL,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.TOKEN_COST_MANAGEMENT,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "outdated diff removal",
    "token optimization",
    "diff deduplication",
    "context management",
    "AI code generation",
  ],
};
