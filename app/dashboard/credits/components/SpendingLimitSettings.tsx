"use client";

import { useState, useEffect } from "react";
import { useAccountContext } from "@/app/components/contexts/Account";
import { getOwner } from "@/app/actions/supabase/owners/get-owner";
import { updateSpendingLimit } from "@/app/actions/supabase/owners/update-spending-limit";
import { CREDIT_PRICING } from "@/config/pricing";

export default function SpendingLimitSettings() {
  const { currentOwnerId: ownerId } = useAccountContext();
  const [spendingLimit, setSpendingLimit] = useState<number | null>(
    CREDIT_PRICING.SPENDING_LIMIT.DEFAULT_AMOUNT_USD
  );
  const [hasLimit, setHasLimit] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchOwnerSettings = async () => {
      if (!ownerId) return;

      setLoading(true);
      try {
        const owner = await getOwner(ownerId);
        if (owner) {
          const limit = owner.max_spending_limit_usd;
          setHasLimit(limit !== null);
          setSpendingLimit(limit || CREDIT_PRICING.SPENDING_LIMIT.DEFAULT_AMOUNT_USD);
        }
      } catch (error) {
        console.error("Error fetching spending limit settings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOwnerSettings();
  }, [ownerId]);

  const handleSave = async () => {
    if (!ownerId) return;

    setSaving(true);
    try {
      await updateSpendingLimit({
        ownerId,
        maxSpendingLimitUsd: hasLimit ? spendingLimit : null,
      });
      console.log("Spending limit settings saved successfully");
    } catch (error) {
      console.error("Error saving spending limit settings:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleChange = async (newHasLimit: boolean) => {
    setHasLimit(newHasLimit);

    // Save silently in background without showing loading state
    if (!ownerId) return;

    updateSpendingLimit({
      ownerId,
      maxSpendingLimitUsd: newHasLimit ? spendingLimit : null,
    }).catch((error) => {
      console.error("Error saving spending limit toggle:", error);
      // Revert toggle on error
      setHasLimit(!newHasLimit);
    });
  };

  const handleLimitChange = (newLimit: number) => {
    // For NaN (empty input), set to null instead of 0
    setSpendingLimit(isNaN(newLimit) ? null : newLimit);
  };

  const isValidAmount =
    spendingLimit !== null && spendingLimit >= CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD;

  return (
    <div
      className="bg-white rounded-lg shadow p-6 flex flex-col"
      data-testid="spending-limit-settings"
    >
      <h2 className="text-lg font-semibold mt-0 mb-4">Spending Limit</h2>

      <div className="space-y-4 flex-1 flex flex-col">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Enable Spending Limit</label>
          <button
            type="button"
            onClick={() => handleToggleChange(!hasLimit)}
            disabled={loading || !ownerId}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 ${
              hasLimit ? "bg-pink-600" : "bg-gray-200"
            } ${loading || !ownerId ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                hasLimit ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${!hasLimit ? "text-gray-400" : ""}`}>
            Maximum monthly spending:
          </label>
          <div className="relative">
            <span
              className={`absolute left-3 top-1/2 -translate-y-1/2 ${!hasLimit ? "text-gray-400" : "text-gray-500"}`}
            >
              $
            </span>
            <input
              type="number"
              value={spendingLimit || ""}
              onChange={(e) =>
                handleLimitChange(e.target.value === "" ? NaN : Number(e.target.value))
              }
              min={CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}
              disabled={!hasLimit || loading || !ownerId}
              className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500 ${
                !hasLimit || loading || !ownerId
                  ? "border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed"
                  : hasLimit &&
                      (!spendingLimit ||
                        spendingLimit < CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD)
                    ? "border-red-300 focus:ring-red-500"
                    : "border-gray-300"
              }`}
            />
          </div>
          {hasLimit &&
            (!spendingLimit || spendingLimit < CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD) && (
              <p className="text-xs text-red-500 mt-1">
                Minimum spending limit is ${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}
              </p>
            )}
          <p className="text-xs text-gray-500 mt-1">
            When enabled, automatic purchases will be blocked if they would exceed this monthly
            limit.
          </p>
        </div>

        <div className="flex-1"></div>
        <button
          onClick={handleSave}
          disabled={saving || !hasLimit || loading || !ownerId || !isValidAmount}
          className="w-full py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 mt-auto"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
