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

describe("POST /api/stripe/create-portal-url", () => {
  const mockValidBody = {
    userId: 123,
    jwtToken: "valid-token",
    customerId: "cus_123456",
  };

  const mockPortalSession = {
    url: "https://billing.stripe.com/session/test",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a portal URL successfully", async () => {
    // Mock dependencies
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockResolvedValue(mockPortalSession);

    // Create request
    const request = new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify(mockValidBody),
    });

    // Execute
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(200);
    expect(data).toBe(mockPortalSession.url);
    expect(isValidToken).toHaveBeenCalledWith(mockValidBody.userId.toString(), mockValidBody.jwtToken);
    expect(createCustomerPortalSession).toHaveBeenCalledWith({
      stripe_customer_id: mockValidBody.customerId,
    });
  });

  it("should return 401 for invalid token", async () => {
    // Mock dependencies
    (isValidToken as jest.Mock).mockReturnValue(false);

    // Create request
    const request = new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify(mockValidBody),
    });

    // Execute
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(401);
    expect(await response.text()).toBe("Unauthorized");
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });

  it("should return 400 for invalid request body", async () => {
    // Create request with invalid body (missing required fields)
    const request = new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify({
        userId: 123,
        // Missing jwtToken and customerId
      }),
    });

    // Execute
    const response = await POST(request);
    const data = await response.json();

    // Assert
    expect(response.status).toBe(400);
    expect(data).toHaveProperty("message");
    expect(isValidToken).not.toHaveBeenCalled();
    expect(createCustomerPortalSession).not.toHaveBeenCalled();
  });

  it("should handle Stripe portal creation error", async () => {
    // Mock dependencies
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockRejectedValue(
      new Error("Failed to create portal session")
    );

    // Create request
    const request = new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify(mockValidBody),
    });

    // Execute
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("Failed to create portal session");
    expect(isValidToken).toHaveBeenCalledWith(mockValidBody.userId.toString(), mockValidBody.jwtToken);
    expect(createCustomerPortalSession).toHaveBeenCalledWith({
      stripe_customer_id: mockValidBody.customerId,
    });
  });

  it("should handle missing URL in portal session response", async () => {
    // Mock dependencies
    (isValidToken as jest.Mock).mockReturnValue(true);
    (createCustomerPortalSession as jest.Mock).mockResolvedValue({
      // Return session without URL
    });

    // Create request
    const request = new NextRequest("http://localhost:3000/api/stripe/create-portal-url", {
      method: "POST",
      body: JSON.stringify(mockValidBody),
    });

    // Execute
    const response = await POST(request);

    // Assert
    expect(response.status).toBe(400);
    expect(await response.text()).toBe("No checkout session URL found");
    expect(isValidToken).toHaveBeenCalledWith(mockValidBody.userId.toString(), mockValidBody.jwtToken);
    expect(createCustomerPortalSession).toHaveBeenCalledWith({
      stripe_customer_id: mockValidBody.customerId,
    });
  });
});