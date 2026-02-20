"use client";

import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { GitHubOwnerWithRepos } from "@/app/actions/github/get-installed-repos";
import { JiraSiteWithProjects } from "@/lib/jira";
import { IntegrationRow } from "./useRows";

interface JiraFormProps {
  integrationRows: IntegrationRow[];
  jiraSites: JiraSiteWithProjects[];
  githubOwners: GitHubOwnerWithRepos[];
  onUpdateRow: (
    index: number,
    field: keyof IntegrationRow,
    value: string,
    jiraSites: JiraSiteWithProjects[],
    githubOwners: GitHubOwnerWithRepos[]
  ) => void;
  onAddRow: () => void;
  onDeleteRow: (
    index: number,
    jiraSites: JiraSiteWithProjects[],
    githubOwners: GitHubOwnerWithRepos[]
  ) => void;
}

export function JiraForm({
  integrationRows,
  jiraSites,
  githubOwners,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
}: JiraFormProps) {
  const getProjectsForSite = (siteName: string) =>
    jiraSites.find((site) => site.name === siteName)?.projects || [];

  const getRepositoriesForOwner = (ownerName: string) =>
    Array.isArray(githubOwners)
      ? githubOwners.find((owner) => owner.ownerName === ownerName)?.repositories || []
      : [];

  return (
    <>
      {integrationRows.map((row, index) => (
        <div key={index} className="mt-8 p-4 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_auto] gap-4">
            {/* Jira Site */}
            <div>
              <label>Jira Site</label>
              <select
                value={row.siteName}
                onChange={(e) =>
                  onUpdateRow(index, "siteName", e.target.value, jiraSites, githubOwners)
                }
                className={`w-full p-2 rounded border ${
                  jiraSites.length === 0
                    ? "bg-gray-100 text-gray-400"
                    : row.siteName
                      ? "bg-white"
                      : "bg-red-50"
                }`}
                disabled={jiraSites.length === 0}
              >
                <option value="">Select Site</option>
                {row.siteName && jiraSites.length === 0 && (
                  <option value={row.siteName}>{row.siteName}</option>
                )}
                {jiraSites.map((site) => (
                  <option key={site.id} value={site.name}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Jira Project */}
            <div>
              <label>Jira Project</label>
              <select
                value={row.projectName}
                onChange={(e) =>
                  onUpdateRow(index, "projectName", e.target.value, jiraSites, githubOwners)
                }
                className={`w-full p-2 rounded border ${
                  !row.siteName || jiraSites.length === 0
                    ? "bg-gray-100 text-gray-400"
                    : row.projectName
                      ? "bg-white"
                      : "bg-red-50"
                }`}
                disabled={!row.siteName}
              >
                <option value="">Select Project</option>
                {row.projectName && jiraSites.length === 0 && (
                  <option value={row.projectName}>{row.projectName}</option>
                )}
                {getProjectsForSite(row.siteName).map((project) => (
                  <option key={project.id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* GitHub Owner */}
            <div>
              <label>GitHub Owner</label>
              <select
                value={row.githubOwner}
                onChange={(e) =>
                  onUpdateRow(index, "githubOwner", e.target.value, jiraSites, githubOwners)
                }
                className={`w-full p-2 rounded border ${
                  githubOwners.length === 0
                    ? "bg-gray-100 text-gray-400"
                    : row.githubOwner
                      ? "bg-white"
                      : "bg-red-50"
                }`}
                disabled={githubOwners.length === 0}
              >
                <option value="">Select Owner</option>
                {Array.isArray(githubOwners) &&
                  githubOwners.map((owner) => (
                    <option key={owner.ownerId} value={owner.ownerName}>
                      {owner.ownerName}
                    </option>
                  ))}
              </select>
            </div>

            {/* GitHub Repository */}
            <div>
              <label>GitHub Repository</label>
              <select
                value={row.githubRepository}
                onChange={(e) =>
                  onUpdateRow(index, "githubRepository", e.target.value, jiraSites, githubOwners)
                }
                className={`w-full p-2 rounded border ${
                  !row.githubOwner || githubOwners.length === 0
                    ? "bg-gray-100 text-gray-400"
                    : row.githubRepository
                      ? "bg-white"
                      : "bg-red-50"
                }`}
                disabled={!row.githubOwner}
              >
                <option value="">Select Repository</option>
                {getRepositoriesForOwner(row.githubOwner).map(
                  (repo: { repoId: number; repoName: string }) => (
                    <option key={repo.repoId} value={repo.repoName}>
                      {repo.repoName}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Last Updated */}
            <div>
              <label>Last Updated</label>
              <input
                type="text"
                value={row.lastSyncDate}
                readOnly
                className="w-full p-2 rounded border bg-gray-50"
              />
            </div>

            {/* Reset Button - Simplified */}
            <div className="flex items-end">
              <button
                onClick={() => onDeleteRow(index, jiraSites, githubOwners)}
                className="p-2 text-gray-500 hover:text-red-500"
                title="Reset integration"
              >
                <FontAwesomeIcon icon={faTrash} className="" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Add new row button */}
      <div className="mt-4 text-center">
        <button
          onClick={onAddRow}
          className="border border-gray-300 px-4 py-2 rounded-full hover:bg-red-50"
        >
          +
        </button>
      </div>
    </>
  );
}
