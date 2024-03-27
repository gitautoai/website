const stripe = require("stripe")(process.env.STRIPE_API_KEY);

/**
 * Create a Stripe checkout session.
 * @see https://stripe.com/docs/api/checkout/sessions/create
 */
export const createCheckoutSession = async ({
  customerId,
  origin,
  priceId,
}: {
  customerId: string;
  origin: string; // such as "https://gitauto.ai"
  priceId: string;
}) => {
  try {
    const line_items = [
      {
        price: priceId,
        quantity: 1,
        adjustable_quantity: { enabled: true, maximum: 999 },
      },
    ];

    /**
     * Create a Stripe Checkout Session.
     * @see https://stripe.com/docs/api/checkout/sessions/create
     */
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "subscription", // "subscription" or "payment" or "setup"
      success_url: `${origin}?success=true`,
      cancel_url: `${origin}?canceled=true`,
      client_reference_id: customerId,
      currency: "usd",
      customer: customerId,

      // More parameters are available here:
      after_expiration: {
        recovery: {
          enabled: true,
        },
      },
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
      payment_method_collection: "always", // "always" or "if_required"
      subscription_data: {
        description: "This subscription was created from Checkout Session",
      },

      // We don't offer a trial period when an admin registers his/her payment method.
      // subscription_data: {
      //   trial_period_days: process.env.NEXT_PUBLIC_STRIPE_TRIAL_PERIOD_DAYS, // Has to be at least 1
      // },
      tax_id_collection: { enabled: true },
    });

    return checkoutSession;
  } catch (error: any) {
    throw error;
  }
};

export function createStripeSubscription(customerId: string) {
  const session = stripe.billing_portal.Session.create(
    (customerId = customerId)
    // return_url = "https://gitauto.ai/dashboard"
  );
  return session.url;
}
