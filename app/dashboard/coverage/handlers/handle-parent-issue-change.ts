import { ParentIssue } from "@/app/dashboard/coverage/types";
import { STORAGE_KEYS } from "@/lib/constants";

/**
 * Handle parent issue selection change
 */
export function handleParentIssueChange(
  openIssues: ParentIssue[],
  setSelectedParentIssue: (issue: ParentIssue | null) => void,
  e: React.ChangeEvent<HTMLSelectElement>
) {
  const issue = openIssues.find((i) => i.number === Number(e.target.value));
  setSelectedParentIssue(issue || null);

  // Save selected parent issue to local storage
  if (issue) {
    localStorage.setItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER, String(issue.number));
  } else {
    localStorage.removeItem(STORAGE_KEYS.PARENT_ISSUE_NUMBER);
  }
}
