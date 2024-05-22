import { NextResponse, NextRequest } from "next/server";

import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

import { createCustomerPortalSession } from "@/utils/stripe";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, jwtToken, customerId } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const session = await createCustomerPortalSession({
      stripe_customer_id: customerId,
    });

    if (!session.url) throw new Error("No checkout session URL found");

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
