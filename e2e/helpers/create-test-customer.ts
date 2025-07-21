import { createCustomer } from "@/app/actions/stripe/create-customer";
import stripe from "@/lib/stripe";

export async function createTestCustomer(metadata: Record<string, string> = {}) {
  try {
    // First create customer without payment method
    const result = await createCustomer({
      email: `test-${Date.now()}@example.com`,
      name: "Test Customer",
      metadata: {
        ...metadata,
        test: "true",
        created_for: "e2e_tests",
      },
    });

    if (!result.success || !result.customerId) return result;

    const customerId = result.customerId;

    // Create payment method using token approach (revert to working method)
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: { token: "tok_visa" },
    });

    // Attach to customer
    await stripe.paymentMethods.attach(paymentMethod.id, {
      customer: customerId,
    });

    // Set as default
    await stripe.customers.update(customerId, {
      invoice_settings: {
        default_payment_method: paymentMethod.id,
      },
    });

    return result;
  } catch (error) {
    console.error("Error creating test customer:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
