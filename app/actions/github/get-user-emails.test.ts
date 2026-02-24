import { getUserPrimaryEmail } from "./get-user-emails";

const mockListEmails = jest.fn();

jest.mock("@/app/api/github", () => ({
  getOctokitForUser: () => ({
    users: { listEmailsForAuthenticatedUser: mockListEmails },
  }),
}));

describe("getUserPrimaryEmail", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns the primary verified email", async () => {
    mockListEmails.mockResolvedValue({
      data: [
        { email: "secondary@example.com", primary: false, verified: true },
        { email: "primary@example.com", primary: true, verified: true },
      ],
    });

    const result = await getUserPrimaryEmail("token");

    expect(result).toBe("primary@example.com");
  });

  it("falls back to any verified email when no primary", async () => {
    mockListEmails.mockResolvedValue({
      data: [
        { email: "unverified@example.com", primary: true, verified: false },
        { email: "verified@example.com", primary: false, verified: true },
      ],
    });

    const result = await getUserPrimaryEmail("token");

    expect(result).toBe("verified@example.com");
  });

  it("returns null when no verified emails exist", async () => {
    mockListEmails.mockResolvedValue({
      data: [{ email: "unverified@example.com", primary: false, verified: false }],
    });

    const result = await getUserPrimaryEmail("token");

    expect(result).toBeNull();
  });

  it("returns null when email list is empty", async () => {
    mockListEmails.mockResolvedValue({ data: [] });

    const result = await getUserPrimaryEmail("token");

    expect(result).toBeNull();
  });

  it("returns null on API error", async () => {
    mockListEmails.mockRejectedValue(new Error("Unauthorized"));

    const result = await getUserPrimaryEmail("token");

    expect(result).toBeNull();
  });
});
