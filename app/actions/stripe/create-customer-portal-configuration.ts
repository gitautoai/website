"use server";

import { ABSOLUTE_URLS } from "@/config/urls";
import stripe from "@/lib/stripe";

/**
 * Create a configuration for a customer portal.
 * @see https://stripe.com/docs/api/customer_portal/configurations/create
 */
export const createCustomerPortalConfiguration = async (hasActiveSubscription = false) => {
  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: ABSOLUTE_URLS.GITAUTO.PRIVACY_POLICY,
      terms_of_service_url: ABSOLUTE_URLS.GITAUTO.TERMS_OF_SERVICE,
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["address", "email", "name", "phone", "tax_id"],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      // Enable subscription management only for customers with active subscriptions
      subscription_cancel: { enabled: hasActiveSubscription },
      subscription_update: { enabled: false },
    },
    login_page: { enabled: true },
  });

  return configuration;
};
