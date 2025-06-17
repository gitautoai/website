"use client";

// Local imports
import { useAccountContext } from "@/app/components/Context/Account";

type RepositorySelectorProps = {
  onRepoChange?: (repo: string) => void;
};

export default function RepositorySelector({ onRepoChange }: RepositorySelectorProps) {
  const {
    organizations,
    currentRepoName,
    setCurrentRepoName,
    currentOwnerName,
    setCurrentOwnerName,
    isLoading,
    installations,
    setSelectedIndex,
  } = useAccountContext();

  const handleOwnerChange = (ownerName: string) => {
    const currentOrg = organizations.find((o) => o.ownerName === ownerName);

    if (currentOrg && currentOrg.repositories.length > 0) {
      setCurrentOwnerName(ownerName);

      const newIndex = installations?.findIndex(
        (installation) => installation.owner_name === ownerName
      );
      if (newIndex !== -1) setSelectedIndex(newIndex);

      const firstRepo = currentOrg.repositories[0].repoName;
      handleRepoChange(firstRepo);
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
        <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
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

      {/* Repository Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Repository</label>
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
    </div>
  );
}
