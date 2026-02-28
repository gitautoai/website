import { refreshAccessToken } from "./refresh-access-token";

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("refreshAccessToken", () => {
  const OLD_ENV = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = {
      ...OLD_ENV,
      GMAIL_CLIENT_ID: "test-client-id",
      GMAIL_CLIENT_SECRET: "test-client-secret",
      GMAIL_REFRESH_TOKEN: "test-refresh-token",
    };
  });

  afterEach(() => {
    process.env = OLD_ENV;
  });

  it("should return access token on success", async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ access_token: "new-access-token" }),
    });

    const token = await refreshAccessToken();

    expect(token).toBe("new-access-token");
    expect(mockFetch).toHaveBeenCalledWith("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: expect.any(URLSearchParams),
    });
  });

  it("should return null when env vars are missing", async () => {
    delete process.env.GMAIL_CLIENT_ID;

    const token = await refreshAccessToken();

    expect(token).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return null when token refresh fails", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 401,
      text: () => Promise.resolve("Unauthorized"),
    });

    const token = await refreshAccessToken();

    expect(token).toBeNull();
  });
});
