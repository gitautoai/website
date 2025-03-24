import { NextResponse } from "next/server";
import { fetchWithTiming } from "@/utils/fetch";

export async function POST(request: Request) {
  try {
    const { endpoint, data } = await request.json();
    if (!endpoint) return NextResponse.json({ error: "Endpoint is required" }, { status: 400 });

    const baseUrl =
      process.env.NODE_ENV === "production"
        ? "https://5ze2tkqk7c27bpl5opy5sbilsi0vrdim.lambda-url.us-west-1.on.aws"
        : "https://gitauto.ngrok.dev";

    fetchWithTiming(`${baseUrl}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to proxy request",
      },
      { status: 500 }
    );
  }
}
