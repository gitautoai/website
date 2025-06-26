export function getScheduleName(ownerId: number, repoId: number): string {
  return `gitauto-repo-${ownerId}-${repoId}`;
}
