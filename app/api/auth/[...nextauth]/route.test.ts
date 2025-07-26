// Mock all dependencies before importing
jest.mock("next-auth", () => ({
  default: jest.fn(() => ({
    GET: jest.fn(),
    POST: jest.fn(),
  })),
}));

jest.mock("next-auth/providers/github", () => 
  jest.fn(() => ({
    id: "github",
    name: "GitHub",
    type: "oauth",
  }))
);

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
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
jest.mock("@/app/actions/resend/send-email", () => ({ sendEmail: jest.fn() }));
jest.mock("@/app/actions/resend/templates/generate-welcome-email", () => ({ generateWelcomeEmail: jest.fn() }));
jest.mock("@/app/actions/slack/slack-us", () => ({ slackUs: jest.fn() }));
jest.mock("@/app/actions/supabase/users/get-user", () => ({ getUser: jest.fn() }));
jest.mock("@/app/actions/supabase/users/upsert-user", () => ({ upsertUser: jest.fn() }));
jest.mock("@/utils/generate-random-delay", () => ({ generateRandomDelay: jest.fn() }));
jest.mock("@/utils/parse-name", () => ({ parseName: jest.fn() }));

describe("NextAuth Route", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should export GET and POST handlers", () => {
    const { GET, POST } = require("./route");
    
    expect(GET).toBeDefined();
    expect(POST).toBeDefined();
  });

  it("should configure NextAuth with correct settings", () => {
    const NextAuth = require("next-auth").default;
    
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
  });
});
