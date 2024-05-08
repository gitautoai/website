import { NextResponse, NextRequest } from "next/server";

import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

import stripe from "@/lib/stripe";
import { createCheckoutSession, hasActiveSubscription } from "@/utils/stripe";
import config from "@/config";
import { createCustomerPortalSession } from "@/utils/stripe";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerId: z.string(),
  email: z.string().email(),
  ownerType: z.string(),
  ownerId: z.number(),
  ownerName: z.string(),
  userName: z.string(),
  billingPeriod: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      userId,
      jwtToken,
      customerId,
      email,
      ownerType,
      ownerId,
      ownerName,
      userName,
      billingPeriod,
    } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let session = null;
    // If the customer has an active non-free subscription, redirect to the customer portal
    // Otherwise, create a new checkout session
    if (await hasActiveSubscription(customerId)) {
      session = await createCustomerPortalSession({
        stripe_customer_id: customerId,
      });
      if (!session.url) throw new Error("No billing portal URL found");
    } else {
      let priceId = config.STRIPE_STANDARD_PLAN_PRICE_ID || "";
      if (billingPeriod === "Yearly") {
        priceId = config.STRIPE_STANDARD_PLAN_YEARLY_PRICE_ID || "";
      }
      session = await createCheckoutSession({
        customerId,
        email: email,
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
