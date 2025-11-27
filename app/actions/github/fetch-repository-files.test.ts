import { fetchRepositoryFiles } from "./fetch-repository-files";

const mockGetOctokitForInstallation = jest.fn();

jest.mock("@/app/api/github", () => ({
  getOctokitForInstallation: (...args: unknown[]) => mockGetOctokitForInstallation(...args),
}));

describe("fetchRepositoryFiles", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const installationId = 12345;
  const branch = "main";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch and return repository files", async () => {
    const mockTree = {
      data: {
        tree: [
          { path: "src/index.ts", type: "blob", sha: "abc123", size: 100 },
          { path: "src/utils.ts", type: "blob", sha: "def456", size: 200 },
          { path: "src", type: "tree", sha: "ghi789" }, // Should be filtered out
        ],
      },
    };

    const mockOctokit = {
      rest: {
        git: {
          getTree: jest.fn().mockResolvedValue(mockTree),
        },
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    const result = await fetchRepositoryFiles(ownerName, repoName, installationId, branch);

    expect(result).toEqual([
      { path: "src/index.ts", sha: "abc123", size: 100 },
      { path: "src/utils.ts", sha: "def456", size: 200 },
    ]);
    expect(mockGetOctokitForInstallation).toHaveBeenCalledWith(installationId);
    expect(mockOctokit.rest.git.getTree).toHaveBeenCalledWith({
      owner: ownerName,
      repo: repoName,
      tree_sha: branch,
      recursive: "true",
    });
  });

  it("should handle errors and log them", async () => {
    const mockError = new Error("API Error");
    const mockOctokit = {
      rest: {
        git: {
          getTree: jest.fn().mockRejectedValue(mockError),
        },
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      fetchRepositoryFiles(ownerName, repoName, installationId, branch)
    ).rejects.toThrow("API Error");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error fetching repository files:", mockError);

    consoleErrorSpy.mockRestore();
  });
});
