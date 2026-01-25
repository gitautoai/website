import { fetchRepositoryFiles } from "./fetch-repository-files";

const mockGetOctokitForInstallation = jest.fn();

jest.mock("@/app/api/github", () => ({
  getOctokitForInstallation: (...args: unknown[]) => mockGetOctokitForInstallation(...args),
}));

jest.mock("@/config/gitauto-api", () => ({
  GITAUTO_API_KEY: "test-api-key",
  GITAUTO_API_URL: "https://test-api.example.com",
}));

describe("fetchRepositoryFiles", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const installationId = 12345;
  const branch = "main";

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
  });

  it("should fetch and return repository files from gitauto API", async () => {
    const mockFiles = [
      { path: "src/index.ts", sha: "abc123", size: 100 },
      { path: "src/utils.ts", sha: "def456", size: 200 },
    ];

    const mockOctokit = {
      auth: jest.fn().mockResolvedValue({ token: "test-token" }),
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue(mockFiles),
    });

    const result = await fetchRepositoryFiles(ownerName, repoName, installationId, branch);

    expect(result).toEqual(mockFiles);
    expect(mockGetOctokitForInstallation).toHaveBeenCalledWith(installationId);
    expect(mockOctokit.auth).toHaveBeenCalledWith({ type: "installation" });
    expect(global.fetch).toHaveBeenCalledWith(
      `https://test-api.example.com/api/files/${ownerName}/${repoName}?branch=${branch}`,
      {
        headers: {
          "X-GitHub-Token": "test-token",
          "X-API-Key": "test-api-key",
        },
      },
    );
  });

  it("should throw error when API returns non-ok response", async () => {
    const mockOctokit = {
      auth: jest.fn().mockResolvedValue({ token: "test-token" }),
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("Internal Server Error"),
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(fetchRepositoryFiles(ownerName, repoName, installationId, branch)).rejects.toThrow(
      "Failed to fetch repository files: 500",
    );

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching repository files: 500 Internal Server Error",
    );

    consoleErrorSpy.mockRestore();
  });
});
