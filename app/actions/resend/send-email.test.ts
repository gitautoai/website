import { randomUUID } from "crypto";
import { sendEmail } from "./send-email";
import { resend } from "./index";

// Mock dependencies
jest.mock("crypto");
jest.mock("./index");

const mockRandomUUID = randomUUID as jest.MockedFunction<typeof randomUUID>;
const mockResend = resend as jest.Mocked<typeof resend>;

describe("sendEmail", () => {
  const mockUUID = "test-uuid-123";
  const mockEmailParams = {
    from: "test@example.com",
    to: ["recipient@example.com"],
    subject: "Test Subject",
    text: "Test email content",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockRandomUUID.mockReturnValue(mockUUID);
    
    // Setup default mock for resend.emails.send
    mockResend.emails = {
      send: jest.fn(),
    } as any;
  });

  describe("successful email sending", () => {
    it("should send email successfully without scheduledAt", async () => {
      const mockEmailId = "email-123";
      (mockResend.emails.send as jest.Mock).mockResolvedValue({
        data: { id: mockEmailId },
        error: null,
      });

      const result = await sendEmail(mockEmailParams);

      expect(result).toEqual({
        success: true,
        emailId: mockEmailId,
      });

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: mockEmailParams.from,
          to: mockEmailParams.to,
          cc: undefined,
          subject: mockEmailParams.subject,
          text: mockEmailParams.text,
        },
        {
          idempotencyKey: mockUUID,
        }
      );
    });

    it("should send email successfully with scheduledAt", async () => {
      const mockEmailId = "email-456";
      const scheduledDate = new Date("2024-01-01T10:00:00Z");
      
      (mockResend.emails.send as jest.Mock).mockResolvedValue({
        data: { id: mockEmailId },
        error: null,
      });

      const result = await sendEmail({
        ...mockEmailParams,
        scheduledAt: scheduledDate,
      });

      expect(result).toEqual({
        success: true,
        emailId: mockEmailId,
      });

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: mockEmailParams.from,
          to: mockEmailParams.to,
          cc: undefined,
          subject: mockEmailParams.subject,
          text: mockEmailParams.text,
          scheduledAt: scheduledDate.toISOString(),
        },
        {
          idempotencyKey: mockUUID,
        }
      );
    });

    it("should send email successfully with cc recipients", async () => {
      const mockEmailId = "email-789";
      const ccRecipients = ["cc1@example.com", "cc2@example.com"];
      
      (mockResend.emails.send as jest.Mock).mockResolvedValue({
        data: { id: mockEmailId },
        error: null,
      });

      const result = await sendEmail({
        ...mockEmailParams,
        cc: ccRecipients,
      });

      expect(result).toEqual({
        success: true,
        emailId: mockEmailId,
      });

      expect(mockResend.emails.send).toHaveBeenCalledWith(
        {
          from: mockEmailParams.from,
          to: mockEmailParams.to,
          cc: ccRecipients,
          subject: mockEmailParams.subject,
          text: mockEmailParams.text,
        },
        {
          idempotencyKey: mockUUID,
        }
      );
    });
  });

  describe("error handling", () => {
    it("should handle resend API error", async () => {
      const mockError = { message: "API rate limit exceeded" };
      (mockResend.emails.send as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await sendEmail(mockEmailParams);

      expect(result).toEqual({
        success: false,
        error: mockError.message,
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to send email:", mockError);
      consoleSpy.mockRestore();
    });

    it("should handle thrown Error exception", async () => {
      const errorMessage = "Network connection failed";
      (mockResend.emails.send as jest.Mock).mockRejectedValue(new Error(errorMessage));

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await sendEmail(mockEmailParams);

      expect(result).toEqual({
        success: false,
        error: errorMessage,
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to send email:", expect.any(Error));
      consoleSpy.mockRestore();
    });

    it("should handle thrown non-Error exception", async () => {
      const errorValue = "String error";
      (mockResend.emails.send as jest.Mock).mockRejectedValue(errorValue);

      const consoleSpy = jest.spyOn(console, "error").mockImplementation();

      const result = await sendEmail(mockEmailParams);

      expect(result).toEqual({
        success: false,
        error: "Unknown error",
      });

      expect(consoleSpy).toHaveBeenCalledWith("Failed to send email:", errorValue);
      consoleSpy.mockRestore();
    });
  });
});