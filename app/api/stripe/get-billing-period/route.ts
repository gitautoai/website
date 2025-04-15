// Third party imports
import { NextResponse } from "next/server";

// Local imports
import { BillingPeriod } from "@/app/dashboard/usage/types";
import stripe from "@/lib/stripe";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    // Get owner ID from request
    const { ownerId } = await request.json();
    if (!ownerId) return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });

    // Get customer ID from owners table
    const { data: owner, error: ownerError } = await supabase
      .from("owners")
      .select("stripe_customer_id")
      .eq("owner_id", ownerId)
      .single();
    if (ownerError || !owner)
      return NextResponse.json({ error: "Failed to fetch owner" }, { status: 500 });

    // Get subscription from Stripe
    const subscriptions = await stripe.subscriptions.list({
      customer: owner.stripe_customer_id,
      status: "active",
      limit: 1,
    });
    if (!subscriptions.data.length)
      return NextResponse.json({ error: "No active subscription found" }, { status: 404 });
    const subscription = subscriptions.data[0];
    const currentPeriodStart = new Date(subscription.current_period_start * 1000).toISOString();
    const currentPeriodEnd = new Date(subscription.current_period_end * 1000).toISOString();
    console.log({ currentPeriodStart, currentPeriodEnd });

    return NextResponse.json({
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
    } as BillingPeriod);
  } catch (error) {
    console.error("Error in get-billing-period:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
