import { NextResponse, NextRequest } from "next/server";

import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

import stripe from "@/lib/stripe";
import { createCheckoutSession } from "@/utils/stripe";
// import { NEXT_PUBLIC_SITE_URL } from "@/lib/constants";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerId: z.string(),
  ownerType: z.string(),
  ownerId: z.number(),
  ownerName: z.string(),
  userName: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      jwtToken,
      customerId,
      ownerType,
      ownerId,
      ownerName,
      userName,
    } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const subscription = stripe.subscriptions.list({ customer: customerId });
    let session = null;
    // If the customer has an active subscription, redirect to the customer portal
    // Otherwise, create a new checkout session
    if (
      subscription &&
      "data" in subscription &&
      Array.isArray(subscription["data"]) &&
      subscription["data"].length > 0
    ) {
      session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: process.env.NEXT_PUBLIC_SITE_URL,
      });
      if (!session.url) throw new Error("No billing portal URL found");
    } else {
      let priceId = "";
      if (ownerType === "U") {
        priceId = process.env.STRIPE_USER_PRICE_ID as string;
      }
      if (ownerType === "C") {
        priceId = process.env.STRIPE_ORGANIZATION_PRICE_ID as string;
      }
      session = await createCheckoutSession({
        customerId,
        priceId: priceId,
        metadata: {
          userId: userId,
          userName: userName,
          ownerName: ownerName,
          ownerId: ownerId,
        },
      });
      if (!session.url) throw new Error("No checkout session URL found");
    }

    return NextResponse.json(session.url, { status: 200 });
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return NextResponse.json(
        { message: err.issues[0].message },
        {
          status: 400,
        }
      );
    } else {
      return new NextResponse(err, {
        status: 400,
      });
    }
  }
}
