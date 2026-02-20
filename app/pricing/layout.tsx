import JsonLdScript from "@/app/components/JsonLdScript";
import { PRODUCT_NAME } from "@/config";
import { CREDIT_PRICING, FREE_CREDITS_AMOUNT_USD, FREE_PRS_LIMIT } from "@/config/pricing";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";
import { pricingJsonLd } from "./jsonld";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Pricing - $${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR, Pay-as-You-Go Credits`,
  description: `$${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR, pay as you go. Start with $${FREE_CREDITS_AMOUNT_USD} in free credits (~${FREE_PRS_LIMIT} PRs). No subscriptions. Buy more credits when you need them.`,
  url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} Pricing` }],
  keywords: [
    "GitAuto pricing",
    "automated testing pricing",
    "unit test generation cost",
    "developer tools pricing",
    "GitHub automation pricing",
    "pay per PR testing",
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
