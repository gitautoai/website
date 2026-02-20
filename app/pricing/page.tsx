// Third-party imports
import Link from "next/link";

// Local imports
import FAQ from "@/app/components/home/FAQ";
import PricingTable from "@/app/pricing/components/PricingTable";
import { CREDIT_PRICING, FREE_CREDITS_AMOUNT_USD } from "@/config/pricing";
import { RELATIVE_URLS } from "@/config/urls";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center py-16">
      <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-6">
        ${CREDIT_PRICING.PER_PR.AMOUNT_USD} / PR
      </h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Start with ${FREE_CREDITS_AMOUNT_USD} in free credits, then buy more as you go. No
        subscriptions, no commitments.
      </p>

      <h2 className="text-2xl font-semibold mb-8">Feature Comparison</h2>

      {/* Client Component for interactive parts */}
      <PricingTable />

      <p className="text-center text-gray-500 mt-8">
        Need something custom?{" "}
        <Link href={RELATIVE_URLS.CONTACT} className="text-pink-600 hover:underline">
          Contact us
        </Link>
      </p>

      <div className="max-w-5xl w-full mx-auto mt-16">
        <FAQ initialCategory="pricing" />
      </div>
    </div>
  );
}
