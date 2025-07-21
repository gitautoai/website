"use server";

import { BASE_URL } from "@/config/urls";
import stripe from "@/lib/stripe";
import { checkActiveSubscription } from "./check-active-subscription";
import { createCustomerPortalConfiguration } from "./create-customer-portal-configuration";

/**
 * Create a Stripe customer portal session.
 * @see https://stripe.com/docs/api/customer_portal/sessions/create
 */
export const createCustomerPortalSession = async ({
  stripe_customer_id,
  return_url = BASE_URL,
}: {
  stripe_customer_id: string;
  return_url?: string;
}) => {
  // Check if customer has active subscription to determine portal configuration
  const hasActiveSubscription = await checkActiveSubscription(stripe_customer_id);

  const { id: configurationId } = await createCustomerPortalConfiguration(hasActiveSubscription);
  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    configuration: configurationId,
    locale: "auto", // or "en", "ja", etc.
    return_url,
  });

  // Only return the URL string to avoid serialization issues
  if (!session.url) throw new Error("Failed to create customer portal session");

  return session.url;
};
