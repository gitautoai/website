import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Configure GitAuto to auto-merge pull requests in repositories with branch protection rules requiring approvals. Allow GitAuto to bypass approval requirements while keeping them for human developers.";

export const autoMergeBranchProtectionJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.AUTO_MERGE + "#techarticle",
  headline: `${PRODUCT_NAME} Auto-Merge with Branch Protection`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.ACTIONS.AUTO_MERGE,
  image: THUMBNAILS.DOCS.ACTIONS.AUTO_MERGE,
  author: CREATOR,
  publisher: CREATOR,
  audience: AUDIENCE,
  about: {
    "@type": "Thing",
    name: "Auto-Merge Configuration",
    description: "Bypassing branch protection approval requirements for automated merges",
  },
  teaches: [
    "How to configure branch protection bypass for GitAuto",
    "Allowing auto-merge while requiring human approvals",
    "Setting up GitHub branch protection rules",
    "Troubleshooting auto-merge issues",
  ],
  offers: OFFERS,
};
