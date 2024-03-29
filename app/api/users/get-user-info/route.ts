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

    const user = await prisma.user.findMany({
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
      },
    });

    // owner_type == "U" comes first in the list of users
    user.sort((a: any, b) => {
      if (a.installations.owner_type === "U") {
        return -1;
      }
      return 0;
    });

    return new NextResponse(stringify(user), { status: 200 });
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

export const dynamic = "force-dynamic"