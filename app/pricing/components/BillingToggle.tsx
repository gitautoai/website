"use client";

import { useAccountContext } from "@/app/components/Context/Account";

export default function BillingToggle() {
  const { billingPeriod, setBillingPeriod } = useAccountContext();

  return (
    <div className="inline-flex items-center bg-gray-100 p-1 rounded-full mb-12">
      <button
        className={`px-5 py-2 rounded-full text-sm transition-all ${
          billingPeriod === "Monthly"
            ? "bg-white shadow-sm font-medium"
            : "text-gray-600 hover:text-gray-800"
        }`}
        onClick={() => setBillingPeriod("Monthly")}
      >
        Monthly
      </button>
      <button
        className={`px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2 ${
          billingPeriod === "Yearly"
            ? "bg-white shadow-sm font-medium"
            : "text-gray-600 hover:text-gray-800"
        }`}
        onClick={() => setBillingPeriod("Yearly")}
      >
        Yearly
        <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">
          Save 16%
        </span>
      </button>
    </div>
  );
}
