import { NextRequest, NextResponse } from "next/server";
import { verifyVercelCron } from "./vercel-cron";

describe("verifyVercelCron", () => {
  // Helper to create a mock NextRequest
  const createMockRequest = (userAgent: string | null): NextRequest => {
    return {
      headers: {
        get: (header: string) => (header === "user-agent" ? userAgent : null),
      },
    } as unknown as NextRequest;
  };

  it("should return null if user-agent contains 'vercel-cron'", () => {
    // Verify that a request with the correct user-agent is authorized
    const request = createMockRequest("vercel-cron");
    const result = verifyVercelCron(request);
    expect(result).toBeNull();
  });

  it("should return null if user-agent contains 'vercel-cron' as part of a larger string", () => {
    // Verify that 'vercel-cron' anywhere in the user-agent is accepted
    const request = createMockRequest("Mozilla/5.0 (compatible; vercel-cron/1.0)");
    const result = verifyVercelCron(request);
    expect(result).toBeNull();
  });

  it("should return 401 with correct error message if user-agent does not contain 'vercel-cron'", async () => {
    // Verify that an incorrect user-agent returns a 401 Unauthorized response with the expected error message
    const request = createMockRequest("Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
    const result = verifyVercelCron(request);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(401);

    const body = await result?.json();
    expect(body).toEqual({ error: "Unauthorized - Not a valid Vercel cron request" });
  });

  it("should return 401 if user-agent header is missing", async () => {
    // Verify that a missing user-agent header returns a 401 Unauthorized response
    const request = createMockRequest(null);
    const result = verifyVercelCron(request);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(401);

    const body = await result?.json();
    expect(body).toEqual({ error: "Unauthorized - Not a valid Vercel cron request" });
  });

  it("should return 401 if user-agent is an empty string", async () => {
    // Verify that an empty user-agent string returns a 401 Unauthorized response
    const request = createMockRequest("");
    const result = verifyVercelCron(request);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(401);

    const body = await result?.json();
    expect(body).toEqual({ error: "Unauthorized - Not a valid Vercel cron request" });
  });

  it("should return 401 if user-agent is case-insensitive 'Vercel-Cron'", async () => {
    // Verify that the check is case-sensitive and 'Vercel-Cron' is not accepted
    const request = createMockRequest("Vercel-Cron");
    const result = verifyVercelCron(request);

    expect(result).toBeInstanceOf(NextResponse);
    expect(result?.status).toBe(401);

    const body = await result?.json();
    expect(body).toEqual({ error: "Unauthorized - Not a valid Vercel cron request" });
  });
});
