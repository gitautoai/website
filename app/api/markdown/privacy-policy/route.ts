import { NextResponse, NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const filePath = path.resolve("public/privacy-policy/privacy-policy.md");
    const fileContents = fs.readFileSync(filePath, "utf-8");

    return new NextResponse(JSON.stringify(fileContents), {
      status: 200,
    });
  } catch (err: any) {
    console.error(err);
    return new NextResponse(err, {
      status: 500,
    });
  }
}
