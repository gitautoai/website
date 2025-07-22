"use client";

import { useState } from "react";
import { createCustomerPortalSession } from "@/app/actions/stripe/create-customer-portal-session";
import { useAccountContext } from "@/app/components/contexts/Account";
import CreditPurchaseModal from "./CreditPurchaseModal";

type CreditPurchaseButtonProps = {
  className?: string;
};

export default function CreditPurchaseButton({ className = "" }: CreditPurchaseButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedIndex, installationsSubscribed, currentStripeCustomerId, currentOwnerId } = useAccountContext();

  const hasActiveSubscription =
    selectedIndex != null &&
    installationsSubscribed &&
    installationsSubscribed[selectedIndex] === true;

  const buttonText = hasActiveSubscription ? "Manage" : "Buy Credits";

  const handleClick = async () => {
    if (!currentOwnerId) return;
    
    if (hasActiveSubscription && currentStripeCustomerId) {
      setIsLoading(true);
      try {
        const portalUrl = await createCustomerPortalSession({
          stripe_customer_id: currentStripeCustomerId,
          return_url: window.location.href,
        });
        window.location.href = portalUrl;
      } catch (error) {
        console.error("Error creating customer portal session:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={isLoading || !currentOwnerId}
        data-testid="purchase-credits-button"
        className={`py-2 px-4 rounded-lg font-medium bg-pink-600 text-white hover:bg-pink-700 ${
          isLoading || !currentOwnerId ? "opacity-75 cursor-not-allowed" : ""
        } ${className}`}
      >
        {isLoading ? "Loading..." : buttonText}
      </button>

      <CreditPurchaseModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
}
