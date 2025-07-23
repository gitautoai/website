"use server";

import { ABSOLUTE_URLS } from "@/config/urls";
import stripe from "@/lib/stripe";

/**
 * Create a Stripe checkout session for credit purchases.
 * @see https://stripe.com/docs/api/checkout/sessions/create
 */
export const createCheckoutSession = async ({
  customerId,
  amountUsd,
  metadata,
  cancelUrl,
}: {
  customerId: string;
  amountUsd: number; // Credit amount in whole dollars
  metadata: any;
  cancelUrl?: string;
}) => {
  try {
    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "GitAuto Credits",
            description: "Pre-paid credits for GitAuto PR generation",
          },
          unit_amount: 100, // $1 per unit in cents
        },
        quantity: amountUsd, // Number of dollars
      },
    ];
    /**
     * Create a Stripe Checkout Session.
     * @see https://stripe.com/docs/api/checkout/sessions/create
     */
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment", // "subscription" or "payment" or "setup"
      success_url: ABSOLUTE_URLS.GITAUTO.DASHBOARD.CREDITS_SUCCESS,
      cancel_url: cancelUrl || ABSOLUTE_URLS.GITAUTO.CANCEL_FALLBACK,
      client_reference_id: customerId,
      metadata: metadata,
      customer: customerId,
      // More parameters are available here:
      after_expiration: { recovery: { enabled: true } },
      allow_promotion_codes: true,
      automatic_tax: { enabled: true },
      billing_address_collection: "auto", // "required" or "auto"
      consent_collection: {
        terms_of_service: "none", // "none" or "required". We set "none" because Google Pay and Apple Pay are not supported in case of "required"
      },
      customer_update: customerId
        ? {
            address: "auto", // "never" or "auto"
            name: "auto", // "never" or "auto"
          }
        : undefined,
      invoice_creation: { enabled: true },
      locale: "auto", // or "en", "ja", etc.
      // payment_method_collection is only for subscriptions, not one-time payments
      payment_intent_data: {
        description: "GitAuto credit purchase",
        metadata: metadata,
        setup_future_usage: "off_session", // Required to attach payment method for future auto-charging
      },
      tax_id_collection: { enabled: true },
    });

    // Return a plain object to avoid Next.js serialization errors
    return { ...checkoutSession };
  } catch (error: any) {
    throw error;
  }
};
