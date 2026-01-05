import { Resend } from "resend";

// Mock the Resend class
jest.mock("resend", () => {
  return {
    Resend: jest.fn().mockImplementation((apiKey: string) => {
      return {
        apiKey,
        emails: {
          send: jest.fn(),
        },
      };
    }),
  };
});

// Mock the config module
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-api-key-123",
}));

describe("resend module", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a Resend instance with the API key from config", () => {
    // Clear the module cache to ensure fresh import
    jest.resetModules();

    // Re-apply mocks
    jest.mock("resend", () => {
      return {
        Resend: jest.fn().mockImplementation((apiKey: string) => {
          return {
            apiKey,
            emails: {
              send: jest.fn(),
            },
          };
        }),
      };
    });

    jest.mock("@/config/resend", () => ({
      RESEND_API_KEY: "test-api-key-123",
    }));

    // Import the module
    const { resend } = require("./index");
    const { RESEND_API_KEY } = require("@/config/resend");
    const { Resend: MockedResend } = require("resend");

    // Verify Resend constructor was called with the correct API key
    expect(MockedResend).toHaveBeenCalledWith(RESEND_API_KEY);
    expect(resend).toBeDefined();
    expect(resend.apiKey).toBe("test-api-key-123");
  });

  it("should export a resend instance with emails property", () => {
    const { resend } = require("./index");

    expect(resend).toBeDefined();
    expect(resend.emails).toBeDefined();
    expect(resend.emails.send).toBeDefined();
  });

  it("should handle empty API key from config", () => {
    // Reset modules to test with different config
    jest.resetModules();

    // Mock with empty API key
    jest.mock("resend", () => {
      return {
        Resend: jest.fn().mockImplementation((apiKey: string) => {
          return {
            apiKey,
            emails: {
              send: jest.fn(),
            },
          };
        }),
      };
    });

    jest.mock("@/config/resend", () => ({
      RESEND_API_KEY: "",
    }));

    const { resend } = require("./index");
    const { Resend: MockedResend } = require("resend");

    expect(MockedResend).toHaveBeenCalledWith("");
    expect(resend).toBeDefined();
  });

  it("should create only one instance of Resend", () => {
    jest.resetModules();

    jest.mock("resend", () => {
      return {
        Resend: jest.fn().mockImplementation((apiKey: string) => {
          return {
            apiKey,
            emails: {
              send: jest.fn(),
            },
          };
        }),
      };
    });

    jest.mock("@/config/resend", () => ({
      RESEND_API_KEY: "test-api-key-123",
    }));

    // Import multiple times
    const module1 = require("./index");
    const module2 = require("./index");

    // Should be the same instance (module caching)
    expect(module1.resend).toBe(module2.resend);
  });
});
