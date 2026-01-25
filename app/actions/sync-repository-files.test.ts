import { syncRepositoryFiles } from "./sync-repository-files";

const mockGetDefaultBranch = jest.fn();
const mockGetRepositorySettings = jest.fn();
const mockGetOctokitForInstallation = jest.fn();

jest.mock("@/app/actions/github/get-default-branch", () => ({
  getDefaultBranch: (...args: unknown[]) => mockGetDefaultBranch(...args),
}));

jest.mock("@/app/actions/supabase/repositories/get-repository-settings", () => ({
  getRepositorySettings: (...args: unknown[]) => mockGetRepositorySettings(...args),
}));

jest.mock("@/app/api/github", () => ({
  getOctokitForInstallation: (...args: unknown[]) => mockGetOctokitForInstallation(...args),
}));

jest.mock("@/config/gitauto-api", () => ({
  GITAUTO_API_KEY: "test-api-key",
  GITAUTO_API_URL: "https://test-api.example.com",
}));

describe("syncRepositoryFiles", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const ownerId = 123;
  const repoId = 456;
  const installationId = 789;
  const userName = "Test User";

  beforeEach(() => {
    jest.clearAllMocks();
    global.fetch = jest.fn();

    const mockOctokit = {
      auth: jest.fn().mockResolvedValue({ token: "test-token" }),
    };
    mockGetOctokitForInstallation.mockResolvedValue(mockOctokit);
  });

  it("should trigger sync with default branch when no target_branch in settings", async () => {
    mockGetRepositorySettings.mockResolvedValue({ target_branch: "" });
    mockGetDefaultBranch.mockResolvedValue("main");
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const result = await syncRepositoryFiles(
      ownerName,
      repoName,
      ownerId,
      repoId,
      installationId,
      userName,
    );

    expect(mockGetRepositorySettings).toHaveBeenCalledWith(ownerId, repoId);
    expect(mockGetDefaultBranch).toHaveBeenCalledWith(ownerName, repoName, installationId);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://test-api.example.com/api/${ownerName}/${repoName}/sync_files_from_github_to_coverage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-GitHub-Token": "test-token",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify({
          branch: "main",
          owner_id: ownerId,
          repo_id: repoId,
          user_name: userName,
        }),
      },
    );
    expect(result).toEqual({ status: "syncing", branch: "main" });
  });

  it("should use target_branch from settings when available", async () => {
    mockGetRepositorySettings.mockResolvedValue({ target_branch: "develop" });
    (global.fetch as jest.Mock).mockResolvedValue({ ok: true });

    const result = await syncRepositoryFiles(
      ownerName,
      repoName,
      ownerId,
      repoId,
      installationId,
      userName,
    );

    expect(mockGetRepositorySettings).toHaveBeenCalledWith(ownerId, repoId);
    expect(mockGetDefaultBranch).not.toHaveBeenCalled();

    expect(global.fetch).toHaveBeenCalledWith(
      `https://test-api.example.com/api/${ownerName}/${repoName}/sync_files_from_github_to_coverage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-GitHub-Token": "test-token",
          "X-API-Key": "test-api-key",
        },
        body: JSON.stringify({
          branch: "develop",
          owner_id: ownerId,
          repo_id: repoId,
          user_name: userName,
        }),
      },
    );
    expect(result).toEqual({ status: "syncing", branch: "develop" });
  });

  it("should throw error when API returns non-ok response", async () => {
    mockGetRepositorySettings.mockResolvedValue({ target_branch: "main" });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue("Internal Server Error"),
    });

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      syncRepositoryFiles(ownerName, repoName, ownerId, repoId, installationId, userName),
    ).rejects.toThrow("Failed to trigger sync: 500");

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error triggering sync: 500 Internal Server Error",
    );

    consoleErrorSpy.mockRestore();
  });
});
