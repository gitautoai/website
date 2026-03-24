import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const DESCRIPTION =
  "Learn how GitAuto detects and preserves the original line ending style (LF vs CRLF) of files, preventing massive diffs from line ending changes.";

export const lineEndingPreservationJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  "@id": ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION + "#techarticle",
  name: `${PRODUCT_NAME} Line Ending Preservation`,
  headline: `${PRODUCT_NAME} Line Ending Preservation`,
  description: DESCRIPTION,
  url: ABSOLUTE_URLS.GITAUTO.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION.LINE_ENDING_PRESERVATION,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.DOCS.HOW_IT_WORKS.OUTPUT_AUTO_CORRECTION,
  datePublished: new Date().toISOString(),
  dateModified: new Date().toISOString(),
  offers: OFFERS,
  keywords: [
    "line endings",
    "LF vs CRLF",
    "Windows line endings",
    "cross-platform",
    "diff noise prevention",
  ],
};
