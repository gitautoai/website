import { PRResponse } from "@/app/dashboard/coverage/types";
import { Tables } from "@/types/supabase";
import { fetchWithTiming } from "@/utils/fetch";

/**
 * Handle creating GitHub PRs for selected coverage items
 */
export async function handleCreatePRs({
  selectedRows,
  coverageData,
  currentOwnerName,
  currentRepoName,
  accessToken,
  hasLabel = false,
  setCoverageData,
  setSelectedRows,
  setActionSuccess,
  setError,
  setIsCreatingPRs,
}: {
  selectedRows: number[];
  coverageData: Tables<"coverages">[];
  currentOwnerName: string;
  currentRepoName: string;
  accessToken: string;
  hasLabel?: boolean;
  setCoverageData: (fn: (prev: Tables<"coverages">[]) => Tables<"coverages">[]) => void;
  setSelectedRows: (rows: number[]) => void;
  setActionSuccess: (success: boolean) => void;
  setError: (error: string) => void;
  setIsCreatingPRs: (loading: boolean) => void;
}) {
  if (selectedRows.length === 0) return;

  setIsCreatingPRs(true);
  try {
    const selectedCoverages = coverageData.filter((item) => selectedRows.includes(item.id));

    const { prs } = await fetchWithTiming<{ prs: PRResponse[] }>(
      "/api/github/create-coverage-prs",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedCoverages,
          ownerName: currentOwnerName,
          repoName: currentRepoName,
          accessToken,
          hasLabel,
        }),
      }
    );

    // Update local state with PR URLs
    setCoverageData((prevData) =>
      prevData.map((item) => {
        const pr = prs.find((p) => p.coverageId === item.id);
        if (pr) return { ...item, github_issue_url: pr.prUrl };
        return item;
      })
    );

    setSelectedRows([]);
    setActionSuccess(true);
  } catch (error) {
    console.error("Error creating PRs:", error);
    setError(
      typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Failed to create PRs"
    );
  } finally {
    setIsCreatingPRs(false);
  }
}
