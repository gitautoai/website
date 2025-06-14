import { AUDIENCE, softwareApplicationData } from "@/app/structured-data";
import { PRODUCT_NAME } from "@/config";
import { ABSOLUTE_URLS } from "@/config/urls";

/**
 * @see https://schema.org/Product
 */
export const pricingStructuredData = {
  "@context": "https://schema.org",
  "@type": "Product",
  "@id": ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS + "#product",
  name: `${PRODUCT_NAME} Pricing Plans`,
  description: "Choose the GitAuto plan that fits your team's needs.",
  brand: { "@type": "Brand", name: PRODUCT_NAME },
  manufacturer: {
    "@type": "Organization",
    name: PRODUCT_NAME,
    url: ABSOLUTE_URLS.GITAUTO.INDEX,
  },
  offers: softwareApplicationData.offers.map((offer) => ({
    ...offer,
    availability: "https://schema.org/InStock",
    validFrom: "2024-05-10",
    itemOffered: {
      "@type": "Service",
      name: `GitAuto ${offer.name}`,
      description: offer.description,
    },
    priceSpecification: {
      "@type": "PriceSpecification",
      price: offer.price,
      priceCurrency: offer.priceCurrency,
      billingIncrement: offer.name.includes("Yearly") ? "P1Y" : "P1M",
    },
  })),
  category: "Developer Tools",
  audience: AUDIENCE,
};
