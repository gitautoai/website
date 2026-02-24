import { isPrd } from "@/config";

export function getScheduleName(ownerId: number, repoId: number): string {
  const suffix = isPrd ? "" : "-dev";
  return `gitauto-repo-${ownerId}-${repoId}${suffix}`;
}
