import { getOpenIssues } from "./get-open-issues";

const mockGetGraphQLForInstallation = jest.fn();

jest.mock("@/app/api/github", () => ({
  getGraphQLForInstallation: (...args: unknown[]) => mockGetGraphQLForInstallation(...args),
}));

describe("getOpenIssues", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const installationId = 12345;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch all open issues with pagination", async () => {
    const mockGraphqlClient = jest
      .fn()
      .mockResolvedValueOnce({
        repository: {
          issues: {
            nodes: [
              { id: "1", number: 1, title: "Issue 1", url: "https://github.com/test/1" },
              { id: "2", number: 2, title: "Issue 2", url: "https://github.com/test/2" },
            ],
            pageInfo: {
              hasNextPage: true,
              endCursor: "cursor1",
            },
          },
        },
      })
      .mockResolvedValueOnce({
        repository: {
          issues: {
            nodes: [{ id: "3", number: 3, title: "Issue 3", url: "https://github.com/test/3" }],
            pageInfo: {
              hasNextPage: false,
              endCursor: "cursor2",
            },
          },
        },
      });

    mockGetGraphQLForInstallation.mockResolvedValue(mockGraphqlClient);

    const result = await getOpenIssues(ownerName, repoName, installationId);

    expect(mockGetGraphQLForInstallation).toHaveBeenCalledWith(installationId);
    expect(mockGraphqlClient).toHaveBeenCalledTimes(2);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual({
      id: "1",
      number: 1,
      title: "Issue 1",
      url: "https://github.com/test/1",
    });
  });

  it("should handle empty results", async () => {
    const mockGraphqlClient = jest.fn().mockResolvedValue({
      repository: {
        issues: {
          nodes: [],
          pageInfo: {
            hasNextPage: false,
            endCursor: null,
          },
        },
      },
    });

    mockGetGraphQLForInstallation.mockResolvedValue(mockGraphqlClient);

    const result = await getOpenIssues(ownerName, repoName, installationId);

    expect(result).toEqual([]);
  });

  it("should handle errors", async () => {
    const mockError = new Error("GraphQL error");
    const mockGraphqlClient = jest.fn().mockRejectedValue(mockError);

    mockGetGraphQLForInstallation.mockResolvedValue(mockGraphqlClient);

    await expect(getOpenIssues(ownerName, repoName, installationId)).rejects.toThrow(
      "GraphQL error"
    );
  });
});
