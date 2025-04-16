// Third party imports
import { NextResponse } from "next/server";

// Local imports
import { BillingPeriod } from "@/app/dashboard/usage/types";
import stripe from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(request: Request) {
  try {
    // Get owner ID and stripe_customer_id from request
    const { stripe_customer_id } = await request.json();
    if (!stripe_customer_id)
      return NextResponse.json({ error: "Stripe customer ID is required" }, { status: 400 });

    // Get subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: stripe_customer_id,
      status: "active",
      limit: 1,
    });
    if (!subscriptions.data.length)
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    const subscription: Stripe.Subscription = subscriptions.data[0];

    const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();

    // Get the product ID from the subscription's first item
    const subscriptionItem = subscription.items.data[0];
    const productId = subscriptionItem.price.product as string;

    // Get product metadata for request limit
    const product = await stripe.products.retrieve(productId);
    const baseRequestLimit = parseInt(product.metadata.request_count || "0");
    const interval = subscriptionItem.price.recurring?.interval;
    const requestLimit = interval === "year" ? baseRequestLimit * 12 : baseRequestLimit;

    return NextResponse.json({
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      request_limit: requestLimit,
    } as BillingPeriod);
  } catch (error) {
    console.error("Error in get-billing-period:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
