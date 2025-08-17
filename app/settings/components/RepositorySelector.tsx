"use client";

// Local imports
import { useAccountContext } from "@/app/components/contexts/Account";
import { ABSOLUTE_URLS } from "@/config/urls";

type RepositorySelectorProps = {
  onRepoChange?: (repo: string) => void;
  ownerOnly?: boolean;
};

export default function RepositorySelector({
  onRepoChange,
  ownerOnly = false,
}: RepositorySelectorProps) {
  const {
    organizations,
    currentOwnerName,
    setCurrentOwnerName,
    currentRepoName,
    setCurrentRepoName,
    isLoading,
  } = useAccountContext();

  const handleOwnerChange = (ownerName: string) => {
    const currentOrg = organizations.find((o) => o.ownerName === ownerName);

    if (currentOrg) {
      setCurrentOwnerName(ownerName);

      if (!ownerOnly && currentOrg.repositories.length > 0) {
        const firstRepo = currentOrg.repositories[0];
        handleRepoChange(firstRepo.repoName);
      }
    }
  };

  const handleRepoChange = (repo: string) => {
    const startTime = performance.now();
    setCurrentRepoName(repo);
    onRepoChange?.(repo);
    const endTime = performance.now();
    console.log(`Repository selection change time: ${endTime - startTime}ms`);
  };

  // Find current org based on selected repo
  const currentOrg = organizations.find((org) =>
    org.repositories.some((repo) => repo.repoName === currentRepoName)
  );

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Organization Selector */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">Organization</label>
          <button
            onClick={() => {
              window.open(ABSOLUTE_URLS.GITHUB.OAUTH_GRANT, "_blank", "noopener,noreferrer");
            }}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
            title="Can't see your organization? Check OAuth permissions"
          >
            Missing org?
          </button>
        </div>
        <select
          value={currentOwnerName || ""}
          onChange={(e) => handleOwnerChange(e.target.value)}
          className={`w-full p-2 border rounded-lg ${isLoading ? "bg-gray-100" : "bg-white"}`}
          disabled={isLoading}
        >
          <option value="">Select Organization</option>
          {organizations.map((org) => (
            <option key={org.ownerId} value={org.ownerName}>
              {org.ownerName}
            </option>
          ))}
        </select>
      </div>

      {/* Repository Selector - only show if not ownerOnly */}
      {!ownerOnly && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-gray-700">Repository</label>
          </div>
          <select
            value={currentRepoName || ""}
            onChange={(e) => handleRepoChange(e.target.value)}
            className={`w-full p-2 border rounded-lg ${
              !currentOrg || isLoading ? "bg-gray-100" : "bg-white"
            }`}
            disabled={!currentOrg || isLoading}
          >
            <option value="">Select Repository</option>
            {currentOrg?.repositories.map((repo) => (
              <option key={repo.repoId} value={repo.repoName}>
                {repo.repoName}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
