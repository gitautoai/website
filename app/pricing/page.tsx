// Third-party imports
import { Metadata } from "next";

// Local imports
import FAQ from "@/app/components/HomePage/FAQ";
import BillingToggle from "@/app/pricing/components/BillingToggle";
import PricingTable from "@/app/pricing/components/PricingTable";
import { pricingStructuredData } from "@/app/pricing/jsonld";
import { PRODUCT_NAME } from "@/config";
import { KEYWORDS } from "@/config/keywords";
import { defaultMetadata } from "@/config/metadata";
import { THUMBNAILS } from "@/config/thumbnails";
import { ABSOLUTE_URLS } from "@/config/urls";

const TITLE = `${PRODUCT_NAME} Pricing - Test Coverage Automation Plans`;
const DESCRIPTION = `Choose the ${PRODUCT_NAME} plan that fits your team's needs. Scale from 0% to 90% test coverage without manual effort. Free plan available.`;
const IMAGES = [
  { url: THUMBNAILS.PRICING, width: 1200, height: 630, alt: `${PRODUCT_NAME} Pricing` },
];

export const metadata: Metadata = {
  ...defaultMetadata,
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    ...KEYWORDS,
    `${PRODUCT_NAME} pricing`,
    "test automation pricing",
    "test coverage plans",
    "GitHub testing automation",
    "automated testing subscription",
  ],

  openGraph: {
    ...defaultMetadata.openGraph,
    title: TITLE,
    description: DESCRIPTION,
    url: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS,
    images: IMAGES,
  },

  twitter: {
    ...defaultMetadata.twitter,
    title: TITLE,
    description: DESCRIPTION,
    images: IMAGES,
  },

  alternates: { canonical: ABSOLUTE_URLS.GITAUTO.PRICING_DETAILS },
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingStructuredData) }}
      />
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
