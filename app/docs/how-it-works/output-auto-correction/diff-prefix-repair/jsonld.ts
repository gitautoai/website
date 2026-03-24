import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto ensures unified diff files have proper a/ and b/ prefixes, preventing git apply rejections caused by missing prefixes.";

export const diffPrefixRepairJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR + "#techarticle",
  name: `${PRODUCT_NAME} Diff Prefix Repair`,
  headline: `${PRODUCT_NAME} Diff Prefix Repair`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.DIFF_PREFIX_REPAIR,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "diff prefix repair",
    "unified diff",
    "a/ b/ prefixes",
    "git apply",
    "patch format",
  ],
};
