import { IssueResponse, ParentIssue } from "@/app/dashboard/coverage/types";
import { Tables } from "@/types/supabase";
import { fetchWithTiming } from "@/utils/fetch";

/**
 * Handle creating GitHub issues for selected coverage items
 */
export async function handleCreateIssues({
  selectedRows,
  coverageData,
  currentOwnerName,
  currentRepoName,
  accessToken,
  selectedParentIssue,
  hasLabel = false,
  setCoverageData,
  setSelectedRows,
  setActionSuccess,
  setError,
  setIsCreatingIssues,
}: {
  selectedRows: number[];
  coverageData: Tables<"coverages">[];
  currentOwnerName: string;
  currentRepoName: string;
  accessToken: string;
  selectedParentIssue: ParentIssue | null;
  hasLabel?: boolean;
  setCoverageData: (fn: (prev: Tables<"coverages">[]) => Tables<"coverages">[]) => void;
  setSelectedRows: (rows: number[]) => void;
  setActionSuccess: (success: boolean) => void;
  setError: (error: string) => void;
  setIsCreatingIssues: (loading: boolean) => void;
}) {
  if (selectedRows.length === 0) return;

  setIsCreatingIssues(true);
  try {
    const selectedCoverages = coverageData.filter((item) => selectedRows.includes(item.id));

    const { issues } = await fetchWithTiming<{ issues: IssueResponse[] }>(
      "/api/github/create-coverage-issues",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedCoverages,
          ownerName: currentOwnerName,
          repoName: currentRepoName,
          accessToken,
          parentNodeId: selectedParentIssue?.id,
          hasLabel,
        }),
      }
    );

    // Update local state with new issue URLs
    setCoverageData((prevData) =>
      prevData.map((item) => {
        const issue = issues.find((i) => i.coverageId === item.id);
        if (issue) return { ...item, github_issue_url: issue.issueUrl };
        return item;
      })
    );

    setSelectedRows([]);
    setActionSuccess(true);
  } catch (error) {
    console.error("Error creating issues:", error);
    setError(
      typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Failed to create issues"
    );
  } finally {
    setIsCreatingIssues(false);
  }
}
