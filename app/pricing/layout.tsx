import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { CREDIT_PRICING, FREE_CREDITS_AMOUNT_USD, FREE_PRS_LIMIT } from "@/config/pricing";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { pricingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Pricing - Affordable Plans for Automated Testing`,
  description: `Choose the perfect GitAuto plan for your team. Free plan with $${FREE_CREDITS_AMOUNT_USD} credits (~${FREE_PRS_LIMIT} PRs). Standard plan at $${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR (minimum $${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD} purchase). Enterprise solutions available.`,
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
