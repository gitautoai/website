import { NextResponse, NextRequest } from "next/server";

import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

import stripe from "@/lib/stripe";
const billingCycle = request.query.billingCycle || 'monthly'; // Assuming the request query includes billingCycle

// Further down in your logic where you create portal or checkout session
if (billingCycle === 'yearly') {
  // Logic for yearly billing
} else {
  // Existing logic for monthly billing
}
import { createCheckoutSession, hasActiveSubscription } from "@/utils/stripe";
import config from "@/config";
// import { NEXT_PUBLIC_SITE_URL } from "@/lib/constants";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerId: z.string(),
  email: z.string().email(),
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
      email,
      ownerType,
      ownerId,
      ownerName,
      userName,
    } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let session = null;
    // If the customer has an active non-free subscription, redirect to the customer portal
    // Otherwise, create a new checkout session
    if (await hasActiveSubscription(customerId)) {
      session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: config.NEXT_PUBLIC_SITE_URL,
      });
      if (!session.url) throw new Error("No billing portal URL found");
    } else {
      session = await createCheckoutSession({
        customerId,
        email: email,
        priceId: config.STRIPE_STANDARD_PLAN_PRICE_ID || "",
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
