import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto automatically updates Jest snapshots when generating tests with snapshot assertions, preventing false failures from missing snapshot files.";

export const snapshotAutoUpdateJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE + "#techarticle",
  name: `${PRODUCT_NAME} Snapshot Auto-Update`,
  headline: `${PRODUCT_NAME} Snapshot Auto-Update`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION.SNAPSHOT_AUTO_UPDATE,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.QUALITY_VERIFICATION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "jest snapshots",
    "snapshot testing",
    "auto-update",
    "toMatchSnapshot",
    "quality verification",
  ],
};
