import { NextResponse, NextRequest } from "next/server";

import { prisma } from "@/lib/prisma";
import { z, ZodError } from "zod";
// import { isValidToken } from '@/utils/auth'
const schema = z.object({
  userId: z.string(),
  jwt: z.string(),
});
export async function GET(req: NextRequest) {
  try {
    const params = req.nextUrl.searchParams;
    const { userId, jwt } = schema.parse({
      userId: params.get("userId"),
      jwt: params.get("jwt"),
    });
    console.log(userId, jwt);

    return new NextResponse("Nothing", { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err, {
      status: 400,
    });
  }
}
