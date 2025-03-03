"use client";
import { useGitHub } from "@/components/Context/GitHub";
import { useEffect } from "react";

type RepositorySelectorProps = {
  onRepoChange?: (repo: string) => void;
};

export default function RepositorySelector({ onRepoChange }: RepositorySelectorProps) {
  const { organizations, selectedRepo, setSelectedRepo, isLoading } = useGitHub();

  // Load saved repo from localStorage on component mount
  useEffect(() => {
    const savedRepo = localStorage.getItem("selectedRepo");
    if (savedRepo && !selectedRepo) {
      setSelectedRepo(savedRepo);
      onRepoChange?.(savedRepo);
    }
  }, [organizations, selectedRepo, setSelectedRepo, onRepoChange]);

  const handleRepoChange = (repo: string) => {
    const startTime = performance.now();
    setSelectedRepo(repo);
    // Save to localStorage
    localStorage.setItem("selectedRepo", repo);
    onRepoChange?.(repo);
    const endTime = performance.now();
    console.log(`Repository selection change time: ${endTime - startTime}ms`);
  };

  // Find current org based on selected repo
  const currentOrg = organizations.find((org) =>
    org.repositories.some((repo) => repo.repoName === selectedRepo)
  );

  return (
    <div className="flex flex-col md:flex-row md:gap-4 space-y-4 md:space-y-0">
      {/* Organization Selector */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
        <select
          value={currentOrg?.ownerName || ""}
          onChange={(e) => {
            const startTime = performance.now();
            const org = organizations.find((o) => o.ownerName === e.target.value);
            if (org && org.repositories.length > 0) {
              handleRepoChange(org.repositories[0].repoName);
            }
            const endTime = performance.now();
            console.log(`Organization selection change time: ${endTime - startTime}ms`);
          }}
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
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-2">Repository</label>
        <select
          value={selectedRepo || ""}
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
