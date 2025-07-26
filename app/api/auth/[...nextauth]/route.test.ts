// Mock NextAuth before any imports
const mockHandler = {
  GET: jest.fn(),
  POST: jest.fn(),
};

jest.mock("next-auth", () => {
  return jest.fn(() => mockHandler);
});

jest.mock("next-auth/providers/github", () => {
  return jest.fn(() => ({
    id: "github",
    name: "GitHub",
    type: "oauth",
  }));
});

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(() => "mock-jwt-token"),
}));

jest.mock("@/config", () => ({
  config: {
    GITHUB_CLIENT_ID: "mock-client-id",
    GITHUB_CLIENT_SECRET: "mock-client-secret",
    JWT_SECRET: "mock-jwt-secret",
    NEXTAUTH_SECRET: "mock-nextauth-secret",
  },
  isPrd: false,
  EMAIL_FROM: "test@example.com",
  PRODUCT_NAME: "TestApp",
}));

// Mock all action dependencies
jest.mock("@/app/actions/resend/send-email", () => ({
  sendEmail: jest.fn(() => Promise.resolve({ success: true, emailId: "mock-email-id" })),
}));

jest.mock("@/app/actions/resend/templates/generate-welcome-email", () => ({
  generateWelcomeEmail: jest.fn(() => "Welcome email content"),
}));

jest.mock("@/app/actions/slack/slack-us", () => ({
  slackUs: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock("@/app/actions/supabase/users/get-user", () => ({
  getUser: jest.fn(() => Promise.resolve(null)),
}));

jest.mock("@/app/actions/supabase/users/upsert-user", () => ({
  upsertUser: jest.fn(() => Promise.resolve({ success: true })),
}));

jest.mock("@/utils/generate-random-delay", () => ({
  generateRandomDelay: jest.fn(() => new Date(Date.now() + 30 * 60 * 1000)),
}));

jest.mock("@/utils/parse-name", () => ({
  parseName: jest.fn(() => ({ firstName: "John", lastName: "Doe" })),
}));

describe("NextAuth Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export GET and POST handlers", () => {
    const { GET, POST } = require("./route");
    
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
    expect(GET).toBe(mockHandler.GET);
    expect(POST).toBe(mockHandler.POST);
  });

  it("should configure NextAuth with GitHub provider", () => {
    const NextAuth = require("next-auth");
    const GithubProvider = require("next-auth/providers/github");
    
    // Import the route to trigger NextAuth configuration
    require("./route");
    
    expect(NextAuth).toHaveBeenCalledWith(
      expect.objectContaining({
        providers: expect.any(Array),
        callbacks: expect.objectContaining({
          jwt: expect.any(Function),
          session: expect.any(Function),
        }),
        debug: false,
        secret: "mock-nextauth-secret",
      })
    );
    
    expect(GithubProvider).toHaveBeenCalledWith(
      expect.objectContaining({
        clientId: "mock-client-id",
        clientSecret: "mock-client-secret",
      })
    );
  });
});