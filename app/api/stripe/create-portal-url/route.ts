import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

const stripe = require("stripe")(process.env.STRIPE_API_KEY);

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

    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: process.env.NEXT_PUBLIC_SITE_URL as string,
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
