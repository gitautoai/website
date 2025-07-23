// Local imports
import FAQ from "@/app/components/home/FAQ";
import PricingTable from "@/app/pricing/components/PricingTable";

export default function PricingPage() {
  return (
    <div className="flex flex-col items-center py-16">
      <h1 className="text-4xl md:text-5xl font-bold mt-16 mb-6">Simple, Transparent Pricing</h1>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto text-center mb-12">
        Choose the plan that fits your team&apos;s needs. All plans include our core test generation
        capabilities.
      </p>

      {/* Client Component for interactive parts */}
      <PricingTable />

      <div className="max-w-5xl w-full mx-auto mt-16">
        <FAQ initialCategory="pricing" />
      </div>
    </div>
  );
}
