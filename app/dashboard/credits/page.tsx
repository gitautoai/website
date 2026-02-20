"use client";

// Third party imports
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Confetti from "react-confetti";

// Local imports
import { useAccountContext } from "@/app/components/contexts/Account";
import { getCreditBalance } from "@/app/actions/supabase/owners/get-credit-balance";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Toast from "@/app/components/Toast";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import { CREDIT_PRICING } from "@/config/pricing";

// Local imports (Relative paths)
import CreditBalanceCard from "./components/CreditBalanceCard";
import CreditTransactionHistory from "./components/CreditTransactionHistory";
import AutoReloadSettings from "./components/AutoReloadSettings";
import SpendingLimitSettings from "./components/SpendingLimitSettings";

export default function CreditsPage() {
  const { currentOwnerId } = useAccountContext();
  const searchParams = useSearchParams();
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showCancelToast, setShowCancelToast] = useState(false);
  const [celebrationEffect, setCelebrationEffect] = useState(false);

  // Check for payment success/cancel parameters
  useEffect(() => {
    const success = searchParams.get("success");
    if (success === "true") {
      setShowSuccessToast(true);
      setCelebrationEffect(true);

      // Remove URL parameters without reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);

      // Remove celebration effect after animation
      setTimeout(() => setCelebrationEffect(false), 3000);
    } else if (success === "false") {
      setShowCancelToast(true);

      // Remove URL parameters without reload
      const newUrl = window.location.pathname;
      window.history.replaceState({}, "", newUrl);
    }
  }, [searchParams]);

  const fetchBalance = useCallback(async () => {
    if (!currentOwnerId) {
      setLoading(false);
      return;
    }

    try {
      const creditBalance = await getCreditBalance(currentOwnerId);
      setBalance(creditBalance);
    } catch (err) {
      console.error("Error fetching credit balance:", err);
      setError("Failed to load credit information");
    } finally {
      setLoading(false);
    }
  }, [currentOwnerId]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Refresh balance after successful payment
  useEffect(() => {
    if (showSuccessToast && currentOwnerId) {
      fetchBalance();
    }
  }, [showSuccessToast, currentOwnerId, fetchBalance]);

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="min-h-screen flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Credits Management</h1>
        <RepositorySelector ownerOnly={true} />

        {loading && <LoadingSpinner />}
        {error && <p className="text-red-600">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CreditBalanceCard balance={balance} pricePerPr={CREDIT_PRICING.PER_PR.AMOUNT_USD} />
          <AutoReloadSettings />
          <SpendingLimitSettings />
        </div>

        <CreditTransactionHistory />
      </div>

      {showSuccessToast && (
        <Toast
          type="success"
          message="🎉 Payment successful! Your credits have been added."
          onClose={() => setShowSuccessToast(false)}
          duration={5000}
        />
      )}

      {showCancelToast && (
        <Toast
          type="error"
          message="Payment was cancelled. No charges were made."
          onClose={() => setShowCancelToast(false)}
          duration={5000}
        />
      )}

      {celebrationEffect && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.3}
        />
      )}
    </div>
  );
}
