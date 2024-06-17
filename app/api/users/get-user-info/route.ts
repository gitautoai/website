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
            owners: true,
          },
        },
        users: {
          select: {
            user_name: true,
          },
        },
      },
    });

    // owner_type == "User" comes first in the list of users
    user.sort((a: any, b: any) => {
      if (a.installations.owner_type === "User" && b.installations.owner_type !== "User") {
        return -1;
      } else if (a.installations.owner_type !== "User" && b.installations.owner_type === "User") {
        return 1;
      } else {
        return a.installations.created_at - b.installations.created_at;
      }
    });

    return new NextResponse(stringify(user), { status: 200 });
  } catch (err: any) {
    console.error("Error in get-user-info", err);
    if (err instanceof ZodError) {
      console.error("Zod validation error", err.issues);
      return NextResponse.json({ message: err.issues }, { status: 400 });
    } else {
      console.error("Unexpected error", err.message);
      return new NextResponse(err, { status: 400 });
    }
  }
}
