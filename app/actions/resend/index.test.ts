// Mock Resend before importing
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn() },
    apiKeys: { create: jest.fn() },
    domains: { list: jest.fn() },
  })),
}));

// Mock config
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-api-key",
}));

// Import the module to execute the code
import { resend } from "./index";
import { Resend } from "resend";
import { RESEND_API_KEY } from "@/config/resend";

describe("app/actions/resend/index", () => {
  describe("module initialization", () => {
    it("should export resend instance", () => {
      expect(resend).toBeDefined();
    });

    it("should create Resend instance with API key from config", () => {
      expect(Resend).toHaveBeenCalledWith(RESEND_API_KEY);
      expect(Resend).toHaveBeenCalledWith("test-api-key");
    });
  });

  describe("resend instance properties", () => {
    it("should have emails property", () => {
      expect(resend.emails).toBeDefined();
      expect(typeof resend.emails.send).toBe("function");
    });

    it("should have apiKeys property", () => {
      expect(resend.apiKeys).toBeDefined();
      expect(typeof resend.apiKeys.create).toBe("function");
    });

    it("should have domains property", () => {
      expect(resend.domains).toBeDefined();
      expect(typeof resend.domains.list).toBe("function");
    });
  });

  describe("resend instance type", () => {
    it("should be an instance of Resend", () => {
      expect(resend).toBeInstanceOf(Resend);
    });
  });
});
