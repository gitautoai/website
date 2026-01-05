import { Resend } from "resend";

// Mock the Resend constructor
jest.mock("resend");

// Mock the config
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-api-key",
}));

describe("resend module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a Resend instance with the API key from config", () => {
    // Import after mocks are set up
    const { resend } = require("./index");
    const { RESEND_API_KEY } = require("@/config/resend");

    // Verify Resend constructor was called with the correct API key
    expect(Resend).toHaveBeenCalledWith(RESEND_API_KEY);
    expect(resend).toBeDefined();
  });

  it("should export a resend instance", () => {
    const { resend } = require("./index");
    expect(resend).toBeInstanceOf(Resend);
  });

  it("should handle empty API key", () => {
    // Re-mock with empty API key
    jest.resetModules();
    jest.mock("@/config/resend", () => ({
      RESEND_API_KEY: "",
    }));

    const { resend } = require("./index");
    expect(resend).toBeDefined();
    expect(Resend).toHaveBeenCalled();
  });
});
