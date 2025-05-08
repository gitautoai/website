// Third-party imports
import { NextResponse, NextRequest } from "next/server";
import { z, ZodError } from "zod";
import * as Sentry from "@sentry/nextjs";

// Local imports
import { config } from "@/config";
import { hasActiveSubscription } from "@/lib/stripe/hasActiveSubscription";
import { isValidToken } from "@/utils/auth";
import { createCheckoutSession, createCustomerPortalSession } from "@/utils/stripe";

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
  let body;
  try {
    body = await req.json();
    const { userId, jwtToken, customerId, email, ownerId, ownerName, userName, billingPeriod } =
      schema.parse(body);

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
      session = await createCheckoutSession({
        customerId,
        email: email,
        priceId:
          billingPeriod === "Monthly"
            ? config.STRIPE_STANDARD_PLAN_MONTHLY_PRICE_ID
            : config.STRIPE_STANDARD_PLAN_YEARLY_PRICE_ID,
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

    // If the error is a ZodError, return the first issue message
    if (err instanceof ZodError)
      return NextResponse.json({ message: err.issues[0].message }, { status: 400 });

    // Capture the error with Sentry and return a generic error message
    Sentry.captureException(err, {
      extra: {
        userId: body?.userId || null,
        jwtToken: body?.jwtToken || null,
        customerId: body?.customerId || null,
        email: body?.email || null,
        ownerId: body?.ownerId || null,
        ownerName: body?.ownerName || null,
        userName: body?.userName || null,
        billingPeriod: body?.billingPeriod || null,
      },
    });
    return NextResponse.json({ message: err.message }, { status: 400 });
  }
}
