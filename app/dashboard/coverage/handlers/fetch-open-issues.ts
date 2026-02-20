import { getOpenIssues } from "@/app/actions/github/get-open-issues";
import { ParentIssue } from "@/app/dashboard/coverage/types";
import { STORAGE_KEYS } from "@/lib/constants";
import { safeLocalStorage } from "@/lib/local-storage";

/**
 * Handle fetching open GitHub issues
 */
export async function fetchOpenIssues(
  currentOwnerName: string,
  currentRepoName: string,
  installationId: number,
  setOpenIssues: (issues: ParentIssue[]) => void,
  setSelectedParentIssue: (issue: ParentIssue | null) => void,
  setIsLoadingIssues: (loading: boolean) => void,
  _setError: (error: string) => void,
) {
  setIsLoadingIssues(true);
  try {
    const issues = await getOpenIssues(currentOwnerName, currentRepoName, installationId);
    setOpenIssues(issues);

    // Get saved parent issue number
    const savedParentIssueNumber = safeLocalStorage.getItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER);
    if (savedParentIssueNumber) {
      const savedIssue = issues.find((issue) => issue.number === Number(savedParentIssueNumber));
      if (savedIssue) {
        setSelectedParentIssue(savedIssue);
      } else {
        safeLocalStorage.removeItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER);
      }
    }
  } catch (error) {
    console.error("Error fetching open issues:", error);
    // Don't set error - open issues are optional for parent issue linking
  } finally {
    setIsLoadingIssues(false);
  }
}
