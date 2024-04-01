"use server";
import { NextResponse, NextRequest } from "next/server";

import { z, ZodError } from "zod";
import { isValidToken } from "@/utils/auth";

import { hasActiveSubscription } from "@/utils/stripe";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerIds: z.array(z.string()),
});

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);

    const { userId, jwtToken, customerIds } = schema.parse({
      userId: Number(params.get("userId")),
      jwtToken: params.get("jwtToken"),
      customerIds: params.getAll("customerIds"),
    });

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // If no customerIds are passed, return an empty array
    if (customerIds.length === 1 && customerIds[0].length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    const booleanMapping = [];

    // Passing an array through api query params results in ['string1,string2'] format
    const customerIdsSplit = customerIds[0].split(",");

    for (const customerId of customerIdsSplit) {
      const myBool = await hasActiveSubscription(customerId);
      booleanMapping.push(myBool);
    }

    return NextResponse.json(booleanMapping, { status: 200 });
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
