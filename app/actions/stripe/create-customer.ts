"use server";

import stripe from "@/lib/stripe";

interface CreateCustomerParams {
  email?: string;
  name?: string;
  metadata?: Record<string, string>;
  paymentMethodId?: string;
}

export async function createCustomer({
  email,
  name,
  metadata = {},
  paymentMethodId,
}: CreateCustomerParams = {}) {
  try {
    // Create customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    // Attach payment method if provided
    if (paymentMethodId) {
      await stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });

      // Set as default payment method
      await stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
    }

    return {
      success: true,
      customerId: customer.id,
      customer,
    };
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}