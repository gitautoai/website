import { createGmailDraft } from "./create-draft";

jest.mock("./refresh-access-token", () => ({
  refreshAccessToken: jest.fn(),
}));

import { refreshAccessToken } from "./refresh-access-token";

const mockRefresh = refreshAccessToken as jest.Mock;
const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("createGmailDraft", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a draft and return draft ID", async () => {
    mockRefresh.mockResolvedValue("access-token-123");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "draft-456" }),
    });

    const draftId = await createGmailDraft("user@example.com", "Hello", "Body text");

    expect(draftId).toBe("draft-456");
    expect(mockFetch).toHaveBeenCalledWith(
      "https://gmail.googleapis.com/gmail/v1/users/me/drafts",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer access-token-123",
          "Content-Type": "application/json",
        },
      }),
    );
  });

  it("should return null when access token refresh fails", async () => {
    mockRefresh.mockResolvedValue(null);

    const draftId = await createGmailDraft("user@example.com", "Hello", "Body");

    expect(draftId).toBeNull();
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("should return null when Gmail API returns error", async () => {
    mockRefresh.mockResolvedValue("access-token-123");
    mockFetch.mockResolvedValue({
      ok: false,
      status: 403,
      text: () => Promise.resolve("Forbidden"),
    });

    const draftId = await createGmailDraft("user@example.com", "Hello", "Body");

    expect(draftId).toBeNull();
  });

  it("should base64url-encode MIME message in request body", async () => {
    mockRefresh.mockResolvedValue("access-token-123");
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "draft-789" }),
    });

    await createGmailDraft("test@example.com", "Test Subject", "Test body");

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    const decoded = Buffer.from(body.message.raw, "base64url").toString();
    expect(decoded).toContain("To: test@example.com");
    expect(decoded).toContain("Subject: Test Subject");
    expect(decoded).toContain("Test body");
  });
});
