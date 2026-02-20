import { checkCommitHasSkipCI } from "./check-commit-has-skip-ci";

const mockGetOctokitForInstallation = jest.fn();

jest.mock("@/app/api/github", () => ({
  getOctokitForInstallation: (...args: unknown[]) => mockGetOctokitForInstallation(...args),
}));

describe("checkCommitHasSkipCI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return true when commit message contains [skip ci]", async () => {
    const mockOctokit = {
      repos: {
        getCommit: jest.fn().mockResolvedValue({
          data: {
            commit: {
              message: "Fix bug [skip ci]",
            },
          },
        }),
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit as any);

    const result = await checkCommitHasSkipCI({
      ownerName: "test-owner",
      repoName: "test-repo",
      installationId: 123,
      sha: "abc123",
    });

    expect(result).toBe(true);
    expect(mockOctokit.repos.getCommit).toHaveBeenCalledWith({
      owner: "test-owner",
      repo: "test-repo",
      ref: "abc123",
    });
  });

  it("should return false when commit message does not contain [skip ci]", async () => {
    const mockOctokit = {
      repos: {
        getCommit: jest.fn().mockResolvedValue({
          data: {
            commit: {
              message: "Fix bug",
            },
          },
        }),
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit as any);

    const result = await checkCommitHasSkipCI({
      ownerName: "test-owner",
      repoName: "test-repo",
      installationId: 123,
      sha: "abc123",
    });

    expect(result).toBe(false);
  });

  it("should return false when commit message is empty", async () => {
    const mockOctokit = {
      repos: {
        getCommit: jest.fn().mockResolvedValue({
          data: {
            commit: {
              message: "",
            },
          },
        }),
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit as any);

    const result = await checkCommitHasSkipCI({
      ownerName: "test-owner",
      repoName: "test-repo",
      installationId: 123,
      sha: "abc123",
    });

    expect(result).toBe(false);
  });

  it("should return false when API call fails", async () => {
    const mockOctokit = {
      repos: {
        getCommit: jest.fn().mockRejectedValue(new Error("API error")),
      },
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit as any);

    const result = await checkCommitHasSkipCI({
      ownerName: "test-owner",
      repoName: "test-repo",
      installationId: 123,
      sha: "abc123",
    });

    expect(result).toBe(false);
  });
});
