import { getSetupPRStatus } from "./get-open-setup-pr";

const mockGraphql = jest.fn();

jest.mock("@/app/api/github", () => ({
  getGraphQLForInstallation: jest.fn(() => Promise.resolve(mockGraphql)),
}));

const BOT_USERNAME = "gitauto-ai";

beforeAll(() => {
  process.env.GITHUB_APP_USER_NAME = `${BOT_USERNAME}[bot]`;
});

const baseArgs = { ownerName: "test-owner", repoName: "test-repo", installationId: 123 };

describe("getSetupPRStatus", () => {
  beforeEach(() => jest.clearAllMocks());

  it("returns open status when an open setup PR exists", async () => {
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: {
          nodes: [
            {
              number: 42,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/42",
              author: { login: BOT_USERNAME },
            },
          ],
        },
        closedPRs: { nodes: [] },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result).toEqual({
      status: "open",
      url: "https://github.com/test-owner/test-repo/pull/42",
      number: 42,
      title: "Set up test coverage workflow",
    });
  });

  it("returns closed status with bot comment when setup PR was closed", async () => {
    const botMessage =
      "No test/coverage workflow was created. This repository has no testable code.";
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: { nodes: [] },
        closedPRs: {
          nodes: [
            {
              number: 10,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/10",
              author: { login: BOT_USERNAME },
              comments: {
                nodes: [{ body: botMessage, author: { login: BOT_USERNAME } }],
              },
            },
          ],
        },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result).toEqual({ status: "closed", message: botMessage });
  });

  it("returns none when no setup PR exists", async () => {
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: { nodes: [] },
        closedPRs: { nodes: [] },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result).toEqual({ status: "none" });
  });

  it("ignores PRs not authored by the bot", async () => {
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: {
          nodes: [
            {
              number: 5,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/5",
              author: { login: "some-user" },
            },
          ],
        },
        closedPRs: { nodes: [] },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result).toEqual({ status: "none" });
  });

  it("ignores closed PRs without a bot comment", async () => {
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: { nodes: [] },
        closedPRs: {
          nodes: [
            {
              number: 10,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/10",
              author: { login: BOT_USERNAME },
              comments: {
                nodes: [{ body: "Closing this", author: { login: "some-user" } }],
              },
            },
          ],
        },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result).toEqual({ status: "none" });
  });

  it("prioritizes open PR over closed PR", async () => {
    mockGraphql.mockResolvedValue({
      repository: {
        openPRs: {
          nodes: [
            {
              number: 20,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/20",
              author: { login: BOT_USERNAME },
            },
          ],
        },
        closedPRs: {
          nodes: [
            {
              number: 10,
              title: "Set up test coverage workflow",
              url: "https://github.com/test-owner/test-repo/pull/10",
              author: { login: BOT_USERNAME },
              comments: {
                nodes: [{ body: "No testable code", author: { login: BOT_USERNAME } }],
              },
            },
          ],
        },
      },
    });

    const result = await getSetupPRStatus(baseArgs);

    expect(result.status).toBe("open");
  });
});
