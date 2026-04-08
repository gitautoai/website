import { act, renderHook } from "@testing-library/react";
import { useSetupWorkflow } from "./use-setup-workflow";

const mockGetSetupPRStatus = jest.fn();
const mockSetupCoverageWorkflow = jest.fn().mockResolvedValue(undefined);

jest.mock("@/app/actions/github/get-open-setup-pr", () => ({
  getSetupPRStatus: (...args: unknown[]) => mockGetSetupPRStatus(...args),
}));

jest.mock("@/app/actions/setup-coverage-workflow", () => ({
  setupCoverageWorkflow: (...args: unknown[]) => mockSetupCoverageWorkflow(...args),
}));

jest.mock("@/app/components/Modal", () => () => null);

const baseArgs = {
  ownerName: "test-owner",
  repoName: "test-repo",
  installationId: 123,
  senderName: "user1",
  source: "file-coverage",
};

describe("useSetupWorkflow", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("triggerSetup", () => {
    it("shows existing PR modal when open setup PR exists", async () => {
      mockGetSetupPRStatus.mockResolvedValue({
        status: "open",
        url: "https://github.com/test-owner/test-repo/pull/42",
        number: 42,
        title: "Set up test coverage workflow",
      });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() => result.current.triggerSetup(baseArgs));

      expect(mockSetupCoverageWorkflow).not.toHaveBeenCalled();
      expect(result.current.getRepoStatus("test-repo")).toEqual({
        status: "open",
        url: "https://github.com/test-owner/test-repo/pull/42",
        number: 42,
        title: "Set up test coverage workflow",
      });
    });

    it("shows closed message when setup PR was closed with comment", async () => {
      const message = "No testable code found in this repository.";
      mockGetSetupPRStatus.mockResolvedValue({ status: "closed", message });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() => result.current.triggerSetup(baseArgs));

      expect(mockSetupCoverageWorkflow).not.toHaveBeenCalled();
      expect(result.current.getRepoStatus("test-repo")).toEqual({
        status: "closed",
        message,
      });
    });

    it("triggers setup when no setup PR exists", async () => {
      mockGetSetupPRStatus.mockResolvedValue({ status: "none" });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() => result.current.triggerSetup(baseArgs));

      expect(mockSetupCoverageWorkflow).toHaveBeenCalledWith(
        "test-owner",
        "test-repo",
        123,
        "user1",
        "file-coverage",
      );
      expect(result.current.getRepoStatus("test-repo")?.status).toBe("open");
    });

    it("falls back to setup when status check fails", async () => {
      mockGetSetupPRStatus.mockRejectedValue(new Error("API error"));

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() => result.current.triggerSetup(baseArgs));

      expect(mockSetupCoverageWorkflow).toHaveBeenCalled();
    });
  });

  describe("checkSetupPR", () => {
    it("stores open status for repo", async () => {
      mockGetSetupPRStatus.mockResolvedValue({
        status: "open",
        url: "https://github.com/o/r/pull/1",
        number: 1,
        title: "Set up test coverage workflow",
      });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() =>
        result.current.checkSetupPR({
          ownerName: "o",
          repoName: "my-repo",
          installationId: 1,
        }),
      );

      expect(result.current.getRepoStatus("my-repo")?.status).toBe("open");
    });

    it("stores closed status for repo", async () => {
      mockGetSetupPRStatus.mockResolvedValue({
        status: "closed",
        message: "No testable code",
      });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() =>
        result.current.checkSetupPR({
          ownerName: "o",
          repoName: "docs-repo",
          installationId: 1,
        }),
      );

      expect(result.current.getRepoStatus("docs-repo")).toEqual({
        status: "closed",
        message: "No testable code",
      });
    });

    it("does not store status when none", async () => {
      mockGetSetupPRStatus.mockResolvedValue({ status: "none" });

      const { result } = renderHook(() => useSetupWorkflow());

      await act(() =>
        result.current.checkSetupPR({
          ownerName: "o",
          repoName: "new-repo",
          installationId: 1,
        }),
      );

      expect(result.current.getRepoStatus("new-repo")).toBeNull();
    });
  });
});
