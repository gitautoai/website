import { PRFileChange } from "@/app/actions/github/get-pr-files";

// GitHub check run conclusions (https://docs.github.com/en/rest/checks/runs)
const FAILURE_STATUSES_ARRAY = [
  "failure",
  "timed_out",
  "cancelled",
  "action_required",
  "stale",
] as const;
type FailureStatus = (typeof FAILURE_STATUSES_ARRAY)[number];
export const FAILURE_STATUSES: ReadonlySet<CheckStatus> = new Set<FailureStatus>(FAILURE_STATUSES_ARRAY);

export type CheckStatus = FailureStatus | "success" | "skipped" | "neutral" | "pending" | "none";

export type PRData = {
  number: number;
  title: string;
  url: string;
  headSha: string;
  files: PRFileChange[];
  checkStatus: CheckStatus;
  repoName: string;
  lastFetched: string;
  hasConflicts: boolean;
  createdAt: string;
};
