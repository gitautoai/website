import { syncRepositoryFiles } from "./sync-repository-files";
import { Tables } from "@/types/supabase";

const mockGetDefaultBranch = jest.fn();
const mockFetchRepositoryFiles = jest.fn();
const mockInsertCoverage = jest.fn();
const mockUpdateCoverage = jest.fn();
const mockDeleteCoverage = jest.fn();

jest.mock("@/app/actions/github/get-default-branch", () => ({
  getDefaultBranch: (...args: unknown[]) => mockGetDefaultBranch(...args),
}));

jest.mock("@/app/actions/github/fetch-repository-files", () => ({
  fetchRepositoryFiles: (...args: unknown[]) => mockFetchRepositoryFiles(...args),
}));

jest.mock("@/app/actions/supabase/coverage/insert-coverage", () => ({
  insertCoverage: (...args: unknown[]) => mockInsertCoverage(...args),
}));

jest.mock("@/app/actions/supabase/coverage/update-coverage", () => ({
  updateCoverage: (...args: unknown[]) => mockUpdateCoverage(...args),
}));

jest.mock("@/app/actions/supabase/coverage/delete-coverage", () => ({
  deleteCoverage: (...args: unknown[]) => mockDeleteCoverage(...args),
}));

describe("syncRepositoryFiles", () => {
  const ownerName = "test-owner";
  const repoName = "test-repo";
  const ownerId = 123;
  const repoId = 456;
  const installationId = 789;
  const userId = 111;
  const userName = "Test User";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should sync repository files and insert new files", async () => {
    const existingCoverage: Tables<"coverages">[] = [
      {
        id: 1,
        owner_id: ownerId,
        repo_id: repoId,
        full_path: "src/old.ts",
        file_size: 100,
        statement_coverage: 0,
        branch_coverage: 0,
        function_coverage: 0,
        line_coverage: 0,
        is_excluded_from_testing: false,
        level: "file",
        package_name: null,
        branch_name: "main",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userName,
        updated_by: userName,
        github_issue_url: null,
        language: null,
        path_coverage: null,
        uncovered_branches: null,
        uncovered_functions: null,
        uncovered_lines: null,
        exclusion_reason: null,
      },
    ];

    const fetchedFiles = [
      { path: "src/old.ts", sha: "abc123", size: 100 },
      { path: "src/new.ts", sha: "def456", size: 200 },
    ];

    mockGetDefaultBranch.mockResolvedValue("main");
    mockFetchRepositoryFiles.mockResolvedValue(fetchedFiles);
    mockInsertCoverage.mockResolvedValue(1);
    mockUpdateCoverage.mockResolvedValue(0);
    mockDeleteCoverage.mockResolvedValue(0);

    const result = await syncRepositoryFiles(
      ownerName,
      repoName,
      ownerId,
      repoId,
      installationId,
      userId,
      userName,
      existingCoverage
    );

    expect(mockGetDefaultBranch).toHaveBeenCalledWith(ownerName, repoName, installationId);
    expect(mockFetchRepositoryFiles).toHaveBeenCalledWith(
      ownerName,
      repoName,
      installationId,
      "main"
    );
    expect(mockInsertCoverage).toHaveBeenCalled();
    expect(result).toMatchObject({
      success: true,
      filesCount: 2,
      inserted: 1,
      updated: 0,
      deleted: 0,
      branch: "main",
    });
  });

  it("should update files when size changes", async () => {
    const existingCoverage: Tables<"coverages">[] = [
      {
        id: 1,
        owner_id: ownerId,
        repo_id: repoId,
        full_path: "src/file.ts",
        file_size: 100,
        statement_coverage: 0,
        branch_coverage: 0,
        function_coverage: 0,
        line_coverage: 0,
        is_excluded_from_testing: false,
        level: "file",
        package_name: null,
        branch_name: "main",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userName,
        updated_by: userName,
        github_issue_url: null,
        language: null,
        path_coverage: null,
        uncovered_branches: null,
        uncovered_functions: null,
        uncovered_lines: null,
        exclusion_reason: null,
      },
    ];

    const fetchedFiles = [{ path: "src/file.ts", sha: "abc123", size: 200 }];

    mockGetDefaultBranch.mockResolvedValue("main");
    mockFetchRepositoryFiles.mockResolvedValue(fetchedFiles);
    mockInsertCoverage.mockResolvedValue(0);
    mockUpdateCoverage.mockResolvedValue(1);
    mockDeleteCoverage.mockResolvedValue(0);

    const result = await syncRepositoryFiles(
      ownerName,
      repoName,
      ownerId,
      repoId,
      installationId,
      userId,
      userName,
      existingCoverage
    );

    expect(mockUpdateCoverage).toHaveBeenCalled();
    expect(result).toMatchObject({
      success: true,
      filesCount: 1,
      inserted: 0,
      updated: 1,
      deleted: 0,
    });
  });

  it("should delete files that no longer exist in repository", async () => {
    const existingCoverage: Tables<"coverages">[] = [
      {
        id: 1,
        owner_id: ownerId,
        repo_id: repoId,
        full_path: "src/deleted.ts",
        file_size: 100,
        statement_coverage: 0,
        branch_coverage: 0,
        function_coverage: 0,
        line_coverage: 0,
        is_excluded_from_testing: false,
        level: "file",
        package_name: null,
        branch_name: "main",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        created_by: userName,
        updated_by: userName,
        github_issue_url: null,
        language: null,
        path_coverage: null,
        uncovered_branches: null,
        uncovered_functions: null,
        uncovered_lines: null,
        exclusion_reason: null,
      },
    ];

    const fetchedFiles = [{ path: "src/new.ts", sha: "abc123", size: 100 }];

    mockGetDefaultBranch.mockResolvedValue("main");
    mockFetchRepositoryFiles.mockResolvedValue(fetchedFiles);
    mockInsertCoverage.mockResolvedValue(1);
    mockUpdateCoverage.mockResolvedValue(0);
    mockDeleteCoverage.mockResolvedValue(1);

    const result = await syncRepositoryFiles(
      ownerName,
      repoName,
      ownerId,
      repoId,
      installationId,
      userId,
      userName,
      existingCoverage
    );

    expect(mockDeleteCoverage).toHaveBeenCalledWith([1]);
    expect(result).toMatchObject({
      success: true,
      filesCount: 1,
      inserted: 1,
      updated: 0,
      deleted: 1,
    });
  });

  it("should throw error when sync fails", async () => {
    const mockError = new Error("Sync failed");
    mockGetDefaultBranch.mockRejectedValue(mockError);

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();

    await expect(
      syncRepositoryFiles(ownerName, repoName, ownerId, repoId, installationId, userId, userName, [])
    ).rejects.toThrow("Sync failed");

    expect(consoleErrorSpy).toHaveBeenCalledWith("Error syncing repository files:", mockError);

    consoleErrorSpy.mockRestore();
  });
});
