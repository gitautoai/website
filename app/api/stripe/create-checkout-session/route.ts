import { NextResponse, NextRequest } from "next/server";
import { z, ZodError } from "zod";

// Utils
import { isValidToken } from "@/utils/auth";
import { createCheckoutSession } from "@/utils/stripe";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerId: z.string(),
});

/**
 * Create a Stripe Checkout Session
 * @see https://stripe.com/docs/checkout/quickstart?client=next
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, jwtToken, customerId } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const origin = process.env.NEXT_PUBLIC_SITE_URL as string;

    // Create a Stripe Checkout Session
    // See https://stripe.com/docs/api/checkout/sessions/create
    const checkoutSession = await createCheckoutSession({
      customerId,
      origin,
      priceId: "price_1OylzvKUN3yUNaHzffDuh3rj",
    });

    if (!checkoutSession.url) throw new Error("No checkout session URL found");

    return NextResponse.json(checkoutSession.url, { status: 200 });
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
