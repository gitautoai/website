"use server";
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Utils
import { isValidToken } from "@/utils/auth";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, jwtToken } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await prisma.userInstallation.findMany({
      where: {
        user_id: Number(userId),
        installations: {
          uninstalled_at: null,
        },
      },
      include: {
        installations: true,
      },
    });

    // If no users found, return success
    if (users.length === 0) {
      return NextResponse.json({ messsage: "Success" }, { status: 200 });
    }

    // owner_type == "U" comes first in the list of users, then sort by created at
    users.sort((a: any, b: any) => {
      if (
        a.installations.owner_type === "User" &&
        b.installations.owner_type !== "User"
      ) {
        return -1;
      } else if (
        a.installations.owner_type !== "User" &&
        b.installations.owner_type === "User"
      ) {
        return 1;
      } else {
        return a.installations.created_at - b.installations.created_at;
      }
    });

    await prisma.user_installations.update({
      where: {
        id: users[0].id,
      },
      data: {
        is_selected: true,
      },
    });

    return NextResponse.json({ messsage: "Success" }, { status: 200 });
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
