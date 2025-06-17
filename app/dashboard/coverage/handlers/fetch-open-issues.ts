import { getOpenIssues } from "@/app/actions/github/get-open-issues";
import { ParentIssue } from "@/app/dashboard/coverage/types";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Handle fetching open GitHub issues
 */
export async function fetchOpenIssues(
  currentOwnerName: string,
  currentRepoName: string,
  accessToken: string,
  setOpenIssues: (issues: ParentIssue[]) => void,
  setSelectedParentIssue: (issue: ParentIssue | null) => void,
  setIsLoadingIssues: (loading: boolean) => void,
  setError: (error: string) => void
) {
  setIsLoadingIssues(true);
  try {
    const issues = await getOpenIssues(currentOwnerName, currentRepoName, accessToken);
    setOpenIssues(issues);

    // Get saved parent issue number
    const savedParentIssueNumber = localStorage.getItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER);
    if (savedParentIssueNumber) {
      const savedIssue = issues.find((issue) => issue.number === Number(savedParentIssueNumber));
      if (savedIssue) {
        setSelectedParentIssue(savedIssue);
      } else {
        localStorage.removeItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER);
      }
    }
  } catch (error) {
    console.error("Error fetching open issues:", error);
    setError("Failed to fetch open issues");
  } finally {
    setIsLoadingIssues(false);
  }
}
