import { AUDIENCE, CREATOR } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

export const calculatorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.ROI.CALCULATOR + "#webpage",
  name: `${PRODUCT_NAME} ROI Calculator`,
  description:
    "Interactive calculator to estimate time and cost savings from automated test generation",
  url: ABSOLUTE_URLS.GITAUTO.ROI.CALCULATOR,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.PRICING,
};
