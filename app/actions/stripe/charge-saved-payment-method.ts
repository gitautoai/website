"use server";

import stripe from "@/lib/stripe";

interface ChargePaymentMethodParams {
  customerId: string;
  amountUsd: number;
  description: string;
  metadata: Record<string, string>;
}

interface ChargePaymentMethodResult {
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}

/**
 * Charge a customer using their default payment method
 * Used for auto-reload and other programmatic purchases
 */
export async function chargeSavedPaymentMethod({
  customerId,
  amountUsd,
  description,
  metadata,
}: ChargePaymentMethodParams): Promise<ChargePaymentMethodResult> {
  try {
    // Get customer's default payment method
    const customer = await stripe.customers.retrieve(customerId);
    if (!customer || customer.deleted) return { success: false, error: "Customer not found" };

    const paymentMethodId = customer.invoice_settings?.default_payment_method;
    if (!paymentMethodId) return { success: false, error: "No default payment method found" };
    if (typeof paymentMethodId !== "string") {
      console.error("Unexpected payment method type:", typeof paymentMethodId, paymentMethodId);
      return { success: false, error: "Invalid payment method format" };
    }

    // Get payment method details to determine type
    const paymentMethod = await stripe.paymentMethods.retrieve(paymentMethodId);

    // Create payment intent with specified payment method
    // payment_method_types is required when using error_on_requires_action: true
    // https://docs.stripe.com/api/payment_intents/create
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountUsd * 100, // Convert dollars to cents for Stripe
      currency: "usd",
      customer: customerId,
      payment_method: paymentMethodId,
      payment_method_types: [paymentMethod.type],
      description,
      metadata: {
        ...metadata,
        credit_amount: amountUsd.toString(), // Needed because paymentIntent.amount includes tax
      },
      confirm: true,
      off_session: true,
      error_on_requires_action: true,
    });

    if (paymentIntent.status === "succeeded") {
      return {
        success: true,
        paymentIntentId: paymentIntent.id,
      };
    } else {
      return {
        success: false,
        error: `Payment intent status: ${paymentIntent.status}`,
      };
    }
  } catch (error) {
    // Don't log errors for test customers (reduces noise in test output)
    if (!customerId.includes("test")) console.error("Error charging saved payment method:", error);

    const stripeError = error as { type?: string; message?: string };

    // Handle specific Stripe errors
    if (stripeError.type === "StripeCardError") return { success: false, error: stripeError.message || "Card error" };

    return {
      success: false,
      error: stripeError.message || "Failed to charge payment method",
    };
  }
}
