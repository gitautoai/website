"use client";

import { CREDIT_PRICING } from "@/config/pricing";
import CreditPurchaseButton from "./CreditPurchaseButton";

type CreditBalanceCardProps = {
  balance: number;
  pricePerPr: number;
};

export default function CreditBalanceCard({ balance, pricePerPr }: CreditBalanceCardProps) {
  const prsRemaining = Math.floor(balance / pricePerPr);

  return (
    <div className="bg-white rounded-lg shadow p-6 flex flex-col" data-testid="credit-balance-card">
      <h2 className="text-lg font-semibold mt-0 mb-4">Credit Balance</h2>

      <div className="space-y-3 flex-1 flex flex-col">
        <div className="space-y-2">
          <p className="text-5xl font-semibold" data-testid="credit-balance">
            ${balance}
          </p>
          <p className="text-sm text-gray-600">Available credits</p>
        </div>

        <div className="border-t pt-3">
          <p className="text-xl font-semibold">{prsRemaining} PRs</p>
          <p className="text-sm text-gray-600">Remaining</p>
        </div>

        <p className="text-xs text-gray-500 mt-2">
          ${CREDIT_PRICING.PER_PR.AMOUNT_USD} per PR • Credits expire after 1 year
        </p>
        <div className="flex-1"></div>

        <div className="pt-4">
          <CreditPurchaseButton className="w-full" data-testid="purchase-credits-button" />
        </div>
      </div>
    </div>
  );
}
