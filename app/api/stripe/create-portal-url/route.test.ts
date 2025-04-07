import { NextRequest } from "next/server";
import { POST } from "./route";
import { isValidToken } from "@/utils/auth";
import { createCustomerPortalSession } from "@/utils/stripe";

// Mock the dependencies
jest.mock("@/utils/auth", () => ({
  isValidToken: jest.fn(),
}));

jest.mock("@/utils/stripe", () => ({
  createCustomerPortalSession: jest.fn(),
}));

// Mock console.error to avoid cluttering test output
jest.spyOn(console, "error").mockImplementation(() => {});

describe("POST /api/stripe/create-portal-url", () => {
  const mockValidBody = {
    userId: 123,
    jwtToken: "valid.jwt.token",
    customerId: "cus_123456789",
  };

  const mockRequest = (body: any) =>
    new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify(body),
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a portal URL successfully", async () => {
    // Mock dependencies
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockResolvedValue({
      url: "https://billing.stripe.com/session/test",
    });

    const response = await POST(mockRequest(mockValidBody));
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toBe("https://billing.stripe.com/session/test");
    expect(isValidToken).toHaveBeenCalledWith("123", "valid.jwt.token");
    expect(createCustomerPortalSession).toHaveBeenCalledWith({
      stripe_customer_id: "cus_123456789",
    });
  });

  it("should return 401 for invalid token", async () => {
    (isValidToken as jest.Mock).mockReturnValue(false);

    const response = await POST(mockRequest(mockValidBody));

    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });

  it("should return 400 for missing required fields", async () => {
    const invalidBody = {
      userId: 123,
      // Missing jwtToken and customerId
    };

    const response = await POST(mockRequest(invalidBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("message");
    expect(isValidToken).not.toHaveBeenCalled();
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid userId type", async () => {
    const invalidBody = {
      userId: "123", // Should be number
      jwtToken: "valid.jwt.token",
      customerId: "cus_123456789",
    };

    const response = await POST(mockRequest(invalidBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("message");
    expect(isValidToken).not.toHaveBeenCalled();
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });

  it("should return 400 when session URL is missing", async () => {
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockResolvedValue({
      // URL is missing
    });

    const response = await POST(mockRequest(mockValidBody));

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("No checkout session URL found");
  });

  it("should return 400 when createCustomerPortalSession fails", async () => {
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockRejectedValue(
      new Error("Stripe API error")
    );

    const response = await POST(mockRequest(mockValidBody));

    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Error: Stripe API error");
  });

  it("should handle malformed JSON in request body", async () => {
    const malformedRequest = new NextRequest(
      "http://localhost:3000/api/stripe/create-portal-url",
      {
        method: "POST",
        body: "invalid json",
      }
    );

    const response = await POST(malformedRequest);

    expect(response.status).toBe(400);
  });

  it("should validate customerId is a string", async () => {
    const invalidBody = {
      userId: 123,
      jwtToken: "valid.jwt.token",
      customerId: 123, // Should be string
    };

    const response = await POST(mockRequest(invalidBody));
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data).toHaveProperty("message");
    expect(isValidToken).not.toHaveBeenCalled();
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });
});