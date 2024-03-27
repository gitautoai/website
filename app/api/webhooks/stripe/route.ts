import { NextResponse, NextRequest } from "next/server";
const stripe = require("stripe")(
  "pk_test_51OpME5KUN3yUNaHzo9ekkSABxnPUXrfgJxtCOaZ56mcT0qkSqBLwTolOfywNjP4RhCT0BH4GM0PyZxyAWt7fw8Fy00lAnAi7rx"
);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
import type Stripe from "stripe";

import { prisma } from "@/lib/prisma";
const { v4: uuidv4 } = require("uuid");

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    let event: Stripe.Event;
    const sig = req.headers.get("stripe-signature");
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig as string,
        endpointSecret
      );
    } catch (err: any) {
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 200 });
    }

    switch (event.type) {
      case "charge.failed":
        const chargeFailed = event.data.object;
        // Then define and call a function to handle the event charge.failed
        break;
      case "checkout.session.completed":
        const checkoutSessionCompleted: any = event.data.object;
        const githubUserName: string =
          checkoutSessionCompleted["custom_fields"][0]["text"]["value"];
        // await prisma.owners.upsert({
        //   where: {
        //     owner_name: githubUserName,
        //   },
        //   update: {
        //     stripe_customer_id: checkoutSessionCompleted["id"],
        //   },
        //   create: {
        //     stripe_customer_id: BigInt(Number(uuidv4().replace(/\D/g, ""))), // will remove this line after db change
        //     owner_name: githubUserName,
        //     invoice_id: checkoutSessionCompleted["id"],
        //   },
        // });
        break;
      case "customer.subscription.deleted":
        const customerSubscriptionDeleted = event.data.object;
        // rewmove ter
        // Then define and call a function to handle the event customer.subscription.deleted
        break;
      case "customer.subscription.updated":
        const customerSubscriptionUpdated = event.data.object;
        // Then define and call a function to handle the event customer.subscription.updated
        break;
      // ... handle other event types
      default:
        console.error(`Unhandled event type ${event.type}`);
    }

    return new NextResponse("Nothing", { status: 200 });
  } catch (error: any) {
    return new NextResponse(error, {
      status: 400,
    });
  }
}
