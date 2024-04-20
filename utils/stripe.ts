import config from "@/config";
import stripe from "@/lib/stripe";
/**
 * Create a Stripe checkout session.
 * @see https://stripe.com/docs/api/checkout/sessions/create
 */
export const createCheckoutSession = async ({
  customerId,
  email,
  priceId,
  metadata,
}: {
  customerId: string;
  email: string;
  priceId: string;
  metadata: any;
}) => {
  try {
    const line_items = [
      {
        price: priceId,
        quantity: 1,
        adjustable_quantity: { enabled: true, maximum: 999999 },
      },
    ];
    /**
     * Create a Stripe Checkout Session.
     * @see https://stripe.com/docs/api/checkout/sessions/create
     */
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items,
      mode: "subscription", // "subscription" or "payment" or "setup"
      success_url: `${config.NEXT_PUBLIC_SITE_URL}?success=true`,
      cancel_url: `${config.NEXT_PUBLIC_SITE_URL}?success=false`,
      client_reference_id: customerId,
      currency: "usd",
      metadata: metadata,
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
      // customer_email: email, // TODO To Implement and test in KAN-146
      customer_update: customerId
        ? {
            address: "auto", // "never" or "auto"
            name: "auto", // "never" or "auto"
          }
        : undefined,
      payment_method_collection: "always", // "always" or "if_required"
      subscription_data: {
        description: "This subscription was created from Checkout Session",
        metadata: metadata,
      },

      // We don't offer a trial period when an admin registers his/her payment method.
      // subscription_data: {
      //   trial_period_days: config.NEXT_PUBLIC_STRIPE_TRIAL_PERIOD_DAYS, // Has to be at least 1
      // },
      tax_id_collection: { enabled: true },
    });

    return checkoutSession;
  } catch (error: any) {
    throw error;
  }
};

export const hasActiveSubscription = async (customerId: string) => {
  const subscription = await stripe.subscriptions.list({
    customer: customerId,
  });

  if (
    subscription &&
    "data" in subscription &&
    Array.isArray(subscription["data"]) &&
    subscription["data"].length > 0
  ) {
    for (const sub of subscription["data"]) {
      if (sub.status === "active") {
        for (const item of sub.items.data) {
          if (
            item.price.active === true &&
            item.price.id !== config.STRIPE_FREE_TIER_PRICE_ID
          ) {
            return true;
          }
        }
      }
    }
  }

  return false;
};
