import { AUDIENCE, CREATOR, OFFERS } from "@/app/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/Product
 */
export const pricingJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS + "#webpage",
  name: `${PRODUCT_NAME} Pricing`,
  description: "Affordable pricing plans for automated unit test generation and GitHub integration",
  url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  creator: CREATOR,
  audience: AUDIENCE,
  image: THUMBNAILS.PRICING,
  mainEntity: {
    "@type": "Product",
    name: PRODUCT_NAME,
    description: "Automated unit test generation for GitHub repositories",
    offers: OFFERS,
  },
};
