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

// Create a configuration for a customer portal.
// @see https://stripe.com/docs/api/customer_portal/configurations/create
const createCustomerPortalConfiguration = async () => {
  const configuration = await stripe.billingPortal.configurations.create({
    business_profile: {
      privacy_policy_url: `${process.env.NEXT_PUBLIC_SITE_URL}${config.PRIVACY_POLICY_URL}`,
      terms_of_service_url: `${process.env.NEXT_PUBLIC_SITE_URL}${config.TERMS_OF_SERVICE}`,
    },
    features: {
      customer_update: {
        enabled: true,
        allowed_updates: ["address", "email", "name", "phone", "tax_id"],
      },
      invoice_history: { enabled: true },
      payment_method_update: { enabled: true },
      subscription_cancel: {
        enabled: true,
        cancellation_reason: {
          enabled: true,
          options: [
            "too_expensive",
            "missing_features",
            "switched_service",
            "unused",
            "customer_service",
            "too_complex",
            "low_quality",
            "other",
          ],
        },
        mode: "at_period_end",
      },
      subscription_update: {
        enabled: true,
        default_allowed_updates: ["price", "quantity"], // "price" enables users to change the plan.
        products: [
          // Only seat-based products are allowed.
          {
            product: config.STRIPE_STANDARD_PLAN_PRODUCT_ID,
            prices: [
              config.STRIPE_STANDARD_PLAN_MONTHLY_PRICE_ID,
              config.STRIPE_STANDARD_PLAN_YEARLY_PRICE_ID,
            ],
          },
        ],
        proration_behavior: "create_prorations",
      },
    },
    login_page: { enabled: true },
  });

  return configuration;
};

// Create a Stripe customer portal session.
// https://stripe.com/docs/api/customer_portal/sessions/create
export const createCustomerPortalSession = async ({
  stripe_customer_id,
}: {
  stripe_customer_id: string;
}) => {
  const { id: configurationId } = await createCustomerPortalConfiguration();
  const session = await stripe.billingPortal.sessions.create({
    customer: stripe_customer_id,
    configuration: configurationId,
    locale: "auto", // or "en", "ja", etc.
    return_url: `${process.env.NEXT_PUBLIC_SITE_URL}`,
  });
  return session;
};
