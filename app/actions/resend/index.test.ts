// Mock Resend before importing
jest.mock("resend", () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: { send: jest.fn() },
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
  it("should export resend instance", () => {
    expect(resend).toBeDefined();
  });

  it("should create Resend instance with API key", () => {
    expect(Resend).toHaveBeenCalledWith(RESEND_API_KEY);
  });

  it("should have emails property", () => {
    expect(resend.emails).toBeDefined();
  });
});
