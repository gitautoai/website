import { getCreditBalance } from "@/app/actions/supabase/owners/get-credit-balance";
import { PRResponse } from "@/app/dashboard/coverage/types";
import { CREDIT_PRICING } from "@/config/pricing";
import { Installation } from "@/types/github";
import { Tables } from "@/types/supabase";
import { fetchWithTiming } from "@/utils/fetch";

export type InsufficientCreditsInfo = {
  balance: number;
  required: number;
  numPRs: number;
};

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
  ownerId,
  installations,
  setCoverageData,
  setSelectedRows,
  setActionSuccess,
  setError,
  setIsCreatingPRs,
  setInsufficientCredits,
}: {
  selectedRows: number[];
  coverageData: Tables<"coverages">[];
  currentOwnerName: string;
  currentRepoName: string;
  accessToken: string;
  hasLabel?: boolean;
  ownerId: number;
  installations: Installation[] | undefined;
  setCoverageData: (fn: (prev: Tables<"coverages">[]) => Tables<"coverages">[]) => void;
  setSelectedRows: (rows: number[]) => void;
  setActionSuccess: (success: boolean) => void;
  setError: (error: string) => void;
  setIsCreatingPRs: (loading: boolean) => void;
  setInsufficientCredits: (info: InsufficientCreditsInfo | null) => void;
}) {
  if (selectedRows.length === 0) return;

  // Pre-flight credit check: skip for subscription users
  const currentInstallation = installations?.find((inst) => inst.owner_id === ownerId);
  if (!currentInstallation?.hasActiveSubscription) {
    const balance = await getCreditBalance(ownerId);
    const required = CREDIT_PRICING.PER_PR.AMOUNT_USD * selectedRows.length;
    if (balance < required) {
      console.log("Insufficient credits:", { balance, required, numPRs: selectedRows.length });
      setInsufficientCredits({ balance, required, numPRs: selectedRows.length });
      return;
    }
  }

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
      },
    );

    // Update local state with PR URLs
    setCoverageData((prevData) =>
      prevData.map((item) => {
        const pr = prs.find((p) => p.coverageId === item.id);
        if (pr) return { ...item, github_issue_url: pr.prUrl };
        return item;
      }),
    );

    setSelectedRows([]);
    setActionSuccess(true);
  } catch (error) {
    console.error("Error creating PRs:", error);
    setError(
      typeof error === "object" && error !== null && "message" in error
        ? String(error.message)
        : "Failed to create PRs",
    );
  } finally {
    setIsCreatingPRs(false);
  }
}
