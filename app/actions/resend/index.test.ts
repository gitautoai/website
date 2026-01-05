// Mock Resend before any imports
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

const MockResendConstructor = jest.fn(() => mockResendInstance);

jest.mock("resend", () => ({
  Resend: MockResendConstructor,
}));

// Mock the config
jest.mock("@/config/resend", () => ({
  RESEND_API_KEY: "test-resend-api-key",
}));

describe("app/actions/resend/index", () => {
  let resend: typeof mockResendInstance;
  let RESEND_API_KEY: string;

  beforeAll(() => {
    // Import after mocks are set up
    const resendModule = require("./index");
    const configModule = require("@/config/resend");

    resend = resendModule.resend;
    RESEND_API_KEY = configModule.RESEND_API_KEY;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("module exports", () => {
    it("should export a resend instance", () => {
      expect(resend).toBeDefined();
      expect(resend).toBe(mockResendInstance);
    });

    it("should create Resend instance with API key from config", () => {
      expect(MockResendConstructor).toHaveBeenCalledWith(RESEND_API_KEY);
    });
  });

  describe("resend instance properties", () => {
    it("should have emails property with send method", () => {
      expect(resend.emails).toBeDefined();
      expect(resend.emails.send).toBeDefined();
      expect(typeof resend.emails.send).toBe("function");
    });

    it("should have apiKeys property with create method", () => {
      expect(resend.apiKeys).toBeDefined();
      expect(resend.apiKeys.create).toBeDefined();
      expect(typeof resend.apiKeys.create).toBe("function");
    });

    it("should have domains property with list method", () => {
      expect(resend.domains).toBeDefined();
      expect(resend.domains.list).toBeDefined();
      expect(typeof resend.domains.list).toBe("function");
    });
  });

  describe("instance usage", () => {
    it("should be able to call emails.send", () => {
      mockResendInstance.emails.send.mockResolvedValue({ data: { id: "test-id" } });

      const result = resend.emails.send({
        from: "test@example.com",
        to: ["recipient@example.com"],
        subject: "Test",
        text: "Test email",
      });

      expect(resend.emails.send).toHaveBeenCalled();
      expect(result).resolves.toBeDefined();
    });

    it("should be able to call apiKeys.create", () => {
      mockResendInstance.apiKeys.create.mockResolvedValue({ data: { id: "key-id" } });

      const result = resend.apiKeys.create({ name: "test-key" });

      expect(resend.apiKeys.create).toHaveBeenCalled();
      expect(result).resolves.toBeDefined();
    });

    it("should be able to call domains.list", () => {
      mockResendInstance.domains.list.mockResolvedValue({ data: [] });

      const result = resend.domains.list();

      expect(resend.domains.list).toHaveBeenCalled();
      expect(result).resolves.toBeDefined();
    });
  });
});
