// Mock the Resend class before importing
const mockResendInstance = {
  emails: {
    send: jest.fn(),
  },
  apiKeys: {
    create: jest.fn(),
  },
  domains: {
    list: jest.fn(),
  },
};

const MockResend = jest.fn().mockImplementation(() => mockResendInstance);

jest.mock("resend", () => ({
  Resend: MockResend,
}));

// Mock the config
const mockApiKey = "test-resend-api-key-123";
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: mockApiKey,
}));

describe("app/actions/resend/index", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("resend instance", () => {
    it("should create a Resend instance with the API key from config", () => {
      // Import after mocks are set up
      const { resend } = require("./index");

      // Verify Resend constructor was called with the correct API key
      expect(MockResend).toHaveBeenCalledWith(mockApiKey);
      expect(resend).toBeDefined();
    });

    it("should export a resend instance", () => {
      const { resend } = require("./index");

      expect(resend).toBe(mockResendInstance);
      expect(resend).toBeDefined();
    });

    it("should have emails property", () => {
      const { resend } = require("./index");

      expect(resend.emails).toBeDefined();
      expect(typeof resend.emails.send).toBe("function");
    });

    it("should have apiKeys property", () => {
      const { resend } = require("./index");

      expect(resend.apiKeys).toBeDefined();
      expect(typeof resend.apiKeys.create).toBe("function");
    });

    it("should have domains property", () => {
      const { resend } = require("./index");

      expect(resend.domains).toBeDefined();
      expect(typeof resend.domains.list).toBe("function");
    });
  });

  describe("module initialization", () => {
    it("should initialize Resend with the correct API key", () => {
      // Clear module cache and re-import
      jest.resetModules();

      // Re-apply mocks
      jest.mock("resend", () => ({
        Resend: MockResend,
      }));

      jest.mock("@/config/resend", () => ({
        RESEND_API_KEY: mockApiKey,
      }));

      // Import the module
      require("./index");

      // Verify constructor was called
      expect(MockResend).toHaveBeenCalled();
      expect(MockResend).toHaveBeenCalledWith(mockApiKey);
    });

    it("should handle empty API key", () => {
      jest.resetModules();

      // Mock with empty API key
      jest.mock("resend", () => ({
        Resend: MockResend,
      }));

      jest.mock("@/config/resend", () => ({
        RESEND_API_KEY: "",
      }));

      const { resend } = require("./index");

      expect(MockResend).toHaveBeenCalledWith("");
      expect(resend).toBeDefined();
    });

    it("should create a singleton instance", () => {
      jest.resetModules();

      jest.mock("resend", () => ({
        Resend: MockResend,
      }));

      jest.mock("@/config/resend", () => ({
        RESEND_API_KEY: mockApiKey,
      }));

      // Import multiple times
      const module1 = require("./index");
      const module2 = require("./index");

      // Should be the same instance due to module caching
      expect(module1.resend).toBe(module2.resend);
    });
  });

  describe("edge cases", () => {
    it("should handle undefined API key", () => {
      jest.resetModules();

      jest.mock("resend", () => ({
        Resend: MockResend,
      }));

      jest.mock("@/config/resend", () => ({
        RESEND_API_KEY: undefined,
      }));

      const { resend } = require("./index");

      expect(MockResend).toHaveBeenCalledWith(undefined);
      expect(resend).toBeDefined();
    });

    it("should handle null API key", () => {
      jest.resetModules();

      jest.mock("resend", () => ({
        Resend: MockResend,
      }));

      jest.mock("@/config/resend", () => ({
        RESEND_API_KEY: null,
      }));

      const { resend } = require("./index");

      expect(MockResend).toHaveBeenCalledWith(null);
      expect(resend).toBeDefined();
    });
  });
});
