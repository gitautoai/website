// Mock Resend class before importing the module
jest.mock("resend", () => {
  const mockResendInstance = {
    emails: {
      send: jest.fn(),
    },
  };

  return {
    Resend: jest.fn(() => mockResendInstance),
  };
});

// Mock the config
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-api-key",
}));

describe("app/actions/resend/index", () => {
  it("should export a resend instance", () => {
    const { resend } = require("./index");

    expect(resend).toBeDefined();
  });

  it("should create Resend instance with API key from config", () => {
    const { Resend } = require("resend");
    const { RESEND_API_KEY } = require("@/config/resend");

    expect(Resend).toHaveBeenCalledWith(RESEND_API_KEY);
  });

  it("should have emails property", () => {
    const { resend } = require("./index");

    expect(resend.emails).toBeDefined();
  });
});
