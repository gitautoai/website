import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const methodologyJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.ROI.METHODOLOGY + "#webpage",
  name: `${PRODUCT_NAME} ROI Methodology`,
  description: "How GitAuto calculates ROI for automated test generation with real-world examples",
  url: ABSOLUTE_URLS.GITAUTO.ROI.METHODOLOGY,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.PRICING,
};
