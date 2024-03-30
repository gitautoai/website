import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";

// Utils
import { isValidToken } from "@/utils/auth";

const schema = z.object({
  userId: z.number(),
  jwtToken: z.string(),
  newUserPrimaryId: z.number(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, jwtToken, newUserPrimaryId } = schema.parse(body);

    if (!isValidToken(userId.toString(), jwtToken)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.user.updateMany({
      where: {
        user_id: Number(userId),
        installations: {
          uninstalled_at: null,
        },
      },
      data: {
        is_selected: false,
      },
    });

    await prisma.user.update({
      where: {
        id: newUserPrimaryId,
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
