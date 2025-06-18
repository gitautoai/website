import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { pricingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Pricing - Affordable Plans for Automated Testing`,
  description: `Choose the perfect GitAuto plan for your team. Free plan available with 3 PRs/month. Standard plan at $100/month for 20 PRs. Enterprise solutions available.`,
  url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} Pricing Plans` }],
  keywords: [
    "GitAuto pricing",
    "automated testing pricing",
    "unit test generation cost",
    "developer tools pricing",
    "GitHub automation pricing",
    "testing automation plans",
  ],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLdScript data={pricingJsonLd} />
      {children}
    </>
  );
}
