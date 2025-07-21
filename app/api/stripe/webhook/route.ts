import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";

// Local imports
import { slackUs } from "@/app/actions/slack/slack-us";
import { insertCredits } from "@/app/actions/supabase/credits/insert-credits";
import { STRIPE_WEBHOOK_SECRET } from "@/config";
import stripe from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) return NextResponse.json({ error: "No signature" }, { status: 400 });

  let event: Stripe.Event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(body, signature, STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type !== "payment_intent.succeeded") {
      console.log(`Unhandled event type: ${event.type}`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Handle payment_intent.succeeded
    // https://dashboard.stripe.com/webhooks/we_1RlhgkKUN3yUNaHz7HXoCqJu
    const paymentIntent = event.data.object as Stripe.PaymentIntent;
    const { metadata } = paymentIntent;

    if (!metadata.owner_id || !metadata.credit_amount) {
      console.error("Missing metadata in payment intent:", metadata);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const ownerId = parseInt(metadata.owner_id);
    const creditAmountUsd = parseInt(metadata.credit_amount); // Use metadata because paymentIntent.amount includes tax

    // Check if we already processed this payment intent (idempotency protection)
    const { supabaseAdmin } = await import("@/lib/supabase/server");
    const { data: existingCredit } = await supabaseAdmin
      .from("credits")
      .select("id")
      .eq("stripe_payment_intent_id", paymentIntent.id)
      .single();

    if (existingCredit) {
      console.log(`Payment intent ${paymentIntent.id} already processed, skipping duplicate`);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    await insertCredits({
      owner_id: ownerId,
      amount_usd: creditAmountUsd,
      transaction_type: metadata.auto_reload === "true" ? "auto_reload" : "purchase",
      stripe_payment_intent_id: paymentIntent.id,
      expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year from now
    });

    // Send Slack notification for successful payment
    const isAutoReload = metadata.auto_reload === "true";
    const paymentType = isAutoReload ? "Auto-reload" : "Manual purchase";
    await slackUs(
      `💰 ${paymentType} successful!\n` +
        `Owner: ${ownerId}\n` +
        `Amount: $${creditAmountUsd}\n` +
        `Payment ID: ${paymentIntent.id}`
    );

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
