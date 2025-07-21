"use server";

// Third-party imports
import { NextResponse, NextRequest } from "next/server";
import { z, ZodError } from "zod";

// Local imports
import { checkActiveSubscription } from "@/app/actions/stripe/check-active-subscription";
import { isValidToken } from "@/utils/auth/is-valid-token";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  customerIds: z.array(z.string()),
});

export async function POST(req: NextRequest) {
  const startTime = performance.now();
  const headers = {
    "Cache-Control": "public, max-age=300, s-maxage=600, stale-while-revalidate=900",
  };

  try {
    const body = await req.json();
    const { userId, jwtToken, customerIds } = schema.parse(body);

    // Return 401 if the token is invalid
    if (!isValidToken(userId.toString(), jwtToken))
      return new NextResponse("Unauthorized", { status: 401 });

    // If no customerIds are passed, return an empty array
    if (!customerIds || customerIds.length === 0)
      return NextResponse.json([], { status: 200, headers });

    const subscriptionPromises = customerIds.map((customerId) => checkActiveSubscription(customerId));

    const booleanMapping = await Promise.all(subscriptionPromises);

    const endTime = performance.now();
    const executionTime = endTime - startTime;
    if (executionTime > 1000) {
      console.log(`Subscription check execution time: ${executionTime}ms`);
    }

    return NextResponse.json(booleanMapping, { status: 200, headers });
  } catch (err: any) {
    console.error(err);
    if (err instanceof ZodError) {
      return NextResponse.json({ message: err.issues[0].message }, { status: 400 });
    } else {
      return new NextResponse(err, { status: 400 });
    }
  }
}
