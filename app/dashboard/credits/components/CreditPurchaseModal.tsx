"use client";

import * as Sentry from "@sentry/nextjs";
import { signIn } from "next-auth/react";
import { usePostHog } from "posthog-js/react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAccountContext } from "@/app/components/contexts/Account";
import { createCheckoutSession } from "@/app/actions/stripe/create-checkout-session";
import { updateAutoReloadSettings } from "@/app/actions/supabase/owners/update-auto-reload-settings";
import { CREDIT_PRICING } from "@/config/pricing";
import { validateCreditAmount } from "@/lib/validation/credit-amount";

type CreditPurchaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreditPurchaseModal({ isOpen, onClose }: CreditPurchaseModalProps) {
  const posthog = usePostHog();
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseAmountUsd, setPurchaseAmountUsd] = useState(
    CREDIT_PRICING.PURCHASE_LIMITS.DEFAULT_AMOUNT_USD,
  );
  const [autoReloadThreshold, setAutoReloadThreshold] = useState(
    CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TRIGGER_USD,
  );
  const [autoReloadTarget, setAutoReloadTarget] = useState(
    CREDIT_PRICING.AUTO_RELOAD.DEFAULT_TARGET_USD,
  );
  const [validationError, setValidationError] = useState<string | null>(null);

  const {
    userId,
    jwtToken,
    email,
    userName,
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    currentStripeCustomerId,
  } = useAccountContext();

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleAmountChange = (value: number) => {
    setPurchaseAmountUsd(value);
    const validation = validateCreditAmount(value);
    setValidationError(validation.isValid ? null : validation.error || null);
  };

  async function handlePurchase() {
    setIsLoading(true);

    const validation = validateCreditAmount(purchaseAmountUsd);
    if (!validation.isValid) {
      setValidationError(validation.error || null);
      setIsLoading(false);
      return;
    }

    posthog.capture("$click", {
      $event_type: "credit_purchase_modal",
      $current_url: window.location.href,
      purchase_amount: purchaseAmountUsd,
      auto_reload_threshold: autoReloadThreshold,
      auto_reload_amount: autoReloadTarget,
    });

    try {
      if (!userId || !jwtToken) {
        await signIn("github", { callbackUrl: window.location.pathname });
        return;
      }

      if (!currentOwnerId || !currentOwnerType || !currentOwnerName) return;
      if (!currentStripeCustomerId) return;
      if (!email) return;

      // Save auto-reload settings before redirecting to Stripe
      await updateAutoReloadSettings({
        ownerId: currentOwnerId,
        enabled: true, // Auto-reload is always enabled in the modal
        thresholdUsd: autoReloadThreshold,
        amountUsd: autoReloadTarget,
        updatedBy: `${userId}:${userName}`,
      });

      const session = await createCheckoutSession({
        customerId: currentStripeCustomerId,
        amountUsd: purchaseAmountUsd,
        metadata: {
          user_id: String(userId),
          user_name: userName,
          owner_name: currentOwnerName,
          owner_id: String(currentOwnerId),
          credit_amount: String(purchaseAmountUsd),
        },
        cancelUrl: window.location.href,
      });

      if (session.url) {
        window.location.href = session.url;
      }
    } catch (error) {
      Sentry.captureException(error);
      console.error("Error purchasing credits", error);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold my-0">Purchase Credits</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
              ×
            </button>
          </div>

          <div className="space-y-6">
            {/* Purchase Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">Purchase Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={purchaseAmountUsd}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  min={CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}
                  max={CREDIT_PRICING.PURCHASE_LIMITS.MAX_AMOUNT_USD}
                  className={`pl-8 w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                    validationError
                      ? "border-red-300 focus:ring-red-500"
                      : "border-gray-300 focus:ring-pink-500"
                  }`}
                />
              </div>
              {validationError ? (
                <p className="text-xs text-red-500 mt-1">{validationError}</p>
              ) : (
                <p className="text-xs text-gray-500 mt-1">
                  Min: ${CREDIT_PRICING.PURCHASE_LIMITS.MIN_AMOUNT_USD}, Max: $
                  {CREDIT_PRICING.PURCHASE_LIMITS.MAX_AMOUNT_USD}
                </p>
              )}
            </div>

            {/* Auto-Reload Settings */}
            <div className="border-t pt-4">
              <div className="flex items-center mb-4">
                <input type="checkbox" checked={true} disabled={true} className="mr-2" />
                <label className="text-sm font-medium">Enable Auto-Reload (Recommended)</label>
              </div>
              <p className="text-xs text-gray-600 mb-4">
                Automatically purchase more credits when your balance gets low to avoid service
                interruption.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    When credit balance reaches:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={autoReloadThreshold}
                      onChange={(e) => setAutoReloadThreshold(Number(e.target.value))}
                      min={0}
                      className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Bring credit balance back up to:
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={autoReloadTarget}
                      onChange={(e) => setAutoReloadTarget(Number(e.target.value))}
                      min={10}
                      className="pl-8 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium mb-2">Summary</h3>
              <div className="text-sm text-gray-600 space-y-1">
                <div>Initial purchase: ${purchaseAmountUsd}</div>
                <div>Auto-reload when balance &lt; ${autoReloadThreshold}</div>
                <div>Auto-reload target: ${autoReloadTarget}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePurchase}
                disabled={isLoading || !!validationError}
                className={`flex-1 py-2 px-4 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ${
                  isLoading || validationError ? "opacity-75 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Processing..." : "Purchase Credits"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Render modal using portal to document.body to avoid stacking context issues
  return createPortal(modalContent, document.body);
}
