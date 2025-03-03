import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();

    // Validate URL format
    if (!url || typeof url !== "string") {
      return NextResponse.json({ valid: false, message: "Invalid URL format" }, { status: 400 });
    }

    try {
      // Check if URL is in a valid format
      new URL(url);
    } catch (error) {
      return NextResponse.json({ valid: false, message: "Invalid URL format" }, { status: 400 });
    }

    // Only HTTPS URLs are allowed
    if (!url.startsWith("https://")) {
      return NextResponse.json(
        { valid: false, message: "Only HTTPS URLs are allowed" },
        { status: 400 }
      );
    }

    // Try to access the URL
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 seconds timeout

      const response = await fetch(url, {
        method: "HEAD", // Get headers only, do not fetch content
        signal: controller.signal,
        redirect: "follow", // Follow redirects
      });

      clearTimeout(timeoutId);

      // 200-299 status codes are successful
      if (response.ok) {
        return NextResponse.json({ valid: true });
      } else {
        return NextResponse.json(
          { valid: false, message: `URL returned status code: ${response.status}` },
          { status: 400 }
        );
      }
    } catch (error) {
      return NextResponse.json(
        {
          valid: false,
          message: `Failed to access URL: ${
            error instanceof Error ? error.message : String(error)
          }`,
        },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in validate-url API:", error);
    return NextResponse.json({ valid: false, message: "Internal server error" }, { status: 500 });
  }
}
