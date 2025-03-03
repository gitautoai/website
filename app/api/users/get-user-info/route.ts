"use server";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Utils
import { isValidToken } from "@/utils/auth";
import { stringify } from "@/utils/transform";

const schema = z.object({
  userId: z.string(),
  jwtToken: z.string(),
});
export async function GET(req: NextRequest) {
  const startTime = performance.now();

  // Add caching headers
  const headers = {
    "Cache-Control": "public, max-age=60, s-maxage=120, stale-while-revalidate=300",
  };

  try {
    const url = new URL(req.url);
    const params = new URLSearchParams(url.searchParams);
    const { userId, jwtToken } = schema.parse({
      userId: params.get("userId"),
      jwtToken: params.get("jwtToken"),
    });

    if (!isValidToken(userId, jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const user = await prisma.userInstallation.findMany({
      where: {
        user_id: Number(userId),
        installations: {
          uninstalled_at: null,
        },
      },
      include: {
        installations: {
          include: {
            owners: {
              select: {
                owner_id: true,
                stripe_customer_id: true,
                created_at: true,
                created_by: true,
              },
            },
          },
        },
        users: {
          select: {
            user_name: true,
          },
        },
      },
      orderBy: [
        {
          installations: {
            owner_type: "desc", // Make sure "User" comes first
          },
        },
        {
          installations: {
            created_at: "asc",
          },
        },
      ],
    });

    return new NextResponse(stringify(user), { status: 200, headers });
  } catch (err: any) {
    console.error("Error in get-user-info", err);
    if (err instanceof ZodError) {
      console.error("Zod validation error", err.issues);
      return NextResponse.json({ message: err.issues }, { status: 400 });
    } else {
      console.error("Unexpected error", err.message);
      return new NextResponse(err, { status: 400 });
    }
  } finally {
    const endTime = performance.now();
    console.log(`get-user-info execution time: ${endTime - startTime}ms`);
  }
}
