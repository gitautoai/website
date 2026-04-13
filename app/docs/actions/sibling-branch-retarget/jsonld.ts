import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto safely retargets PRs between sibling release branches by saving changes, resetting to the new base, and rewriting files.";

export const siblingBranchRetargetJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.SIBLING_BRANCH_RETARGET + "#techarticle",
  headline: `${PRODUCT_NAME} Sibling Branch Retarget`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.SIBLING_BRANCH_RETARGET,
  image: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Sibling Branch Retarget",
    description: "Safely retarget PRs between sibling release branches without diff explosion",
  },
  teaches: [
    "Why changing a PR base branch between sibling branches causes diff explosion",
    "How GitAuto saves, resets, and rewrites files to produce a clean diff",
    "Why rebase is not suitable for automation environments",
  ],
  offers: OFFERS,
};
