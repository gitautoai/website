// Local imports
import FAQ from "@/app/components/HomePage/FAQ";
import JsonLdScript from "@/app/components/JsonLdScript";
import BillingToggle from "@/app/pricing/components/BillingToggle";
import PricingTable from "@/app/pricing/components/PricingTable";
import { pricingJsonLd } from "@/app/pricing/jsonld";
import { PRODUCT_NAME } from "@/config";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";
import { createPageMetadata } from "@/utils/metadata";

export const metadata = createPageMetadata({
  title: `${PRODUCT_NAME} Pricing - Test Coverage Automation Plans`,
  description: `Choose the ${PRODUCT_NAME} plan that fits your team's needs. Scale from 0% to 90% test coverage without manual effort. Free plan available.`,
  url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
  images: [{ url: THUMBNAILS.PRICING, alt: `${PRODUCT_NAME} Pricing` }],
  keywords: [
    `${PRODUCT_NAME} pricing`,
    "test automation pricing",
    "test coverage plans",
    "GitHub testing automation",
    "automated testing subscription",
  ],
});

export default function PricingPage() {
  return (
    <>
      <JsonLdScript data={pricingJsonLd} />
      <div className="flex flex-col items-center py-16">
        <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-6">Simple, Transparent Pricing</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
          Choose the plan that fits your team&apos;s needs. All plans include our core test
          generation capabilities.
        </p>

        {/* Client Component for interactive parts */}
        <BillingToggle />
        <PricingTable />

        <div className="max-w-5xl w-full mx-auto mt-16">
          <FAQ initialCategory="pricing" />
        </div>
      </div>
    </>
  );
}
