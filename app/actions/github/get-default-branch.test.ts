import { getDefaultBranch } from "./get-default-branch";

const mockGetOctokitForInstallation = jest.fn();

jest.mock("@/app/api/github", () => ({
  getOctokitForInstallation: (...args: unknown[]) => mockGetOctokitForInstallation(...args),
}));

describe("getDefaultBranch", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const installationId = 12345;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return default branch when repository exists", async () => {
    const mockOctokit = {
      rest: {
        repos: {
          get: jest.fn().mockResolvedValue({
            data: { default_branch: "main" },
          }),
        },
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    const result = await getDefaultBranch(ownerName, repoName, installationId);

    expect(result).toBe("main");
    expect(mockGetOctokitForInstallation).toHaveBeenCalledWith(installationId);
    expect(mockOctokit.rest.repos.get).toHaveBeenCalledWith({
      owner: ownerName,
      repo: repoName,
    });
  });

  it("should return null when repository is not found", async () => {
    const mockOctokit = {
      rest: {
        repos: {
          get: jest.fn().mockRejectedValue(new Error("Not Found")),
        },
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);

    const result = await getDefaultBranch(ownerName, repoName, installationId);

    expect(result).toBeNull();
  });
});
