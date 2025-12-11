import { PRFileChange } from "@/app/actions/github/get-pr-files";

export type PRData = {
  number: number;
  title: string;
  url: string;
  headSha: string;
  files: PRFileChange[];
  checkStatus: "success" | "failure" | "pending" | "none";
  repoName: string;
  lastFetched: string;
  hasConflicts: boolean;
  createdAt: string;
};
