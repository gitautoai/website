"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports (Actions)
import { getAllActionSettings } from "@/app/actions/supabase/repositories/get-all-action-settings";
import { saveActionSettings } from "@/app/actions/supabase/repositories/save-action-settings";
import { slackUs } from "@/app/actions/slack/slack-us";

// Local imports (Components and Types)
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import type { Tables } from "@/types/supabase";

type RepoFeatures = Tables<"repository_features">;

type RepoWithSettings = {
  repoId: number;
  repoName: string;
  settings: Pick<
    RepoFeatures,
    "auto_merge" | "auto_merge_only_test_files" | "merge_method" | "updated_by" | "updated_at"
  > | null;
};

export default function ActionsPage() {
  const { currentOwnerId, currentOwnerName, organizations, userId, userLogin, userName } =
    useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [savingRepoId, setSavingRepoId] = useState<number | null>(null);
  const [repoSettings, setRepoSettings] = useState<RepoWithSettings[]>([]);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showWhoShouldUse, setShowWhoShouldUse] = useState(false);

  useEffect(() => {
    const loadAllSettings = async () => {
      if (!currentOwnerId || !currentOwnerName) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Get repos for current owner from organizations context
        const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
        if (!currentOrg) {
          setIsLoading(false);
          return;
        }

        // Fetch all action settings for this owner
        const allSettings = await getAllActionSettings(currentOwnerId);

        // Create a map of repo_id to settings
        const settingsMap = new Map(allSettings.map((s) => [s.repo_id, s]));

        // Always show all repos for this page (owner-level settings)
        const reposToShow = currentOrg.repositories;

        // Combine repos with their settings (or null if no settings exist)
        const combined: RepoWithSettings[] = reposToShow.map((repo) => ({
          repoId: repo.repoId,
          repoName: repo.repoName,
          settings: settingsMap.has(repo.repoId)
            ? {
                auto_merge: settingsMap.get(repo.repoId)!.auto_merge,
                auto_merge_only_test_files: settingsMap.get(repo.repoId)!
                  .auto_merge_only_test_files,
                merge_method: settingsMap.get(repo.repoId)!.merge_method,
                updated_by: settingsMap.get(repo.repoId)!.updated_by,
                updated_at: settingsMap.get(repo.repoId)!.updated_at,
              }
            : null,
        }));

        setRepoSettings(combined);
      } catch (error) {
        console.error("Failed to load action settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOwnerId, currentOwnerName]);

  const updateSetting = async (
    repoId: number,
    repoName: string,
    field: keyof Pick<RepoFeatures, "auto_merge" | "auto_merge_only_test_files" | "merge_method">,
    value: boolean | string
  ) => {
    if (!currentOwnerId || !currentOwnerName || !userId || !userLogin) return;

    // Find current settings for this repo
    const repoData = repoSettings.find((r) => r.repoId === repoId);
    const currentSettings = repoData?.settings || {
      auto_merge: false,
      auto_merge_only_test_files: true,
      merge_method: "merge",
      updated_at: new Date().toISOString(),
      updated_by: `${userId}:${userLogin}`,
    };

    const updatedSettings = {
      ...currentSettings,
      [field]: value,
    };

    // Optimistic update - update UI immediately
    setRepoSettings((prev) =>
      prev.map((r) => (r.repoId === repoId ? { ...r, settings: updatedSettings } : r))
    );

    // Save to database in background (no await)
    saveActionSettings(
      currentOwnerId,
      currentOwnerName,
      repoId,
      repoName,
      userId,
      userLogin,
      updatedSettings
    ).catch((error) => {
      console.error("Error saving action settings:", error);
      // Revert optimistic update on error
      setRepoSettings((prev) =>
        prev.map((r) => (r.repoId === repoId ? { ...r, settings: currentSettings } : r))
      );
    });

    // Notify via Slack in background (no await)
    const settingLabels: Record<string, string> = {
      auto_merge: "Auto-merge",
      auto_merge_only_test_files: "Auto-merge only test files",
      merge_method: "Merge method",
    };
    const message = `${userName} (${userId}) updated ${settingLabels[field]} to ${value} for ${currentOwnerName}/${repoName}`;
    slackUs(message).catch((error) => console.error("Error sending Slack notification:", error));
  };

  const ColumnHeader = ({
    title,
    description,
    isLast = false,
  }: {
    title: string;
    description: string;
    isLast?: boolean;
  }) => (
    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <span>{title}</span>
        <div className="group relative">
          <svg
            className="w-4 h-4 text-gray-400 cursor-help"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <div
            className={`invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-md shadow-lg ${
              isLast ? "right-0" : "-left-24"
            }`}
          >
            {description}
          </div>
        </div>
      </div>
    </th>
  );

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-left">Action settings</h1>

      <div className="mb-6">
        <RepositorySelector ownerOnly={true} />
      </div>

      <p className="mb-6 text-gray-600">
        Configure auto-merge behavior and merge strategies for all your repositories. Changes are
        saved automatically.
      </p>

      <div className="mb-6 space-y-3">
        {/* How auto-merge works */}
        <div>
          <button
            onClick={() => setShowHowItWorks(!showHowItWorks)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showHowItWorks ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">How auto-merge works</span>
          </button>

          {showHowItWorks && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-700 mb-2">
                Auto-merge happens immediately when check suite completes successfully and:
              </p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
                <li>All status checks pass</li>
                <li>No merge conflicts</li>
                <li>Branch is up to date</li>
                <li>
                  Repository does NOT require reviews (reviews haven&apos;t happened yet at this
                  point)
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                <em>
                  Note: Auto-merge won&apos;t work if your repository requires reviews in branch
                  protection.
                </em>
              </p>
            </div>
          )}
        </div>

        {/* Who should use this */}
        <div>
          <button
            onClick={() => setShowWhoShouldUse(!showWhoShouldUse)}
            className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <svg
              className={`w-4 h-4 transition-transform ${showWhoShouldUse ? "rotate-90" : ""}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Who should use this</span>
          </button>

          {showWhoShouldUse && (
            <div className="mt-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-sm text-gray-600">
                Teams with scheduled triggers creating many PRs per day who are already familiar
                with GitAuto&apos;s changes and want to reduce the manual burden of merging PRs they
                would normally merge without detailed code review when tests pass.
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Repository
                </th>
                <ColumnHeader
                  title="Auto-merge"
                  description="Enable automatic merging when all conditions are met"
                />
                <ColumnHeader
                  title="Only test files"
                  description="Only auto-merge when PR contains exclusively test files"
                />
                <ColumnHeader
                  title="Merge method"
                  description="Method used to merge: merge/squash/rebase"
                />
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b border-gray-200">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repoSettings.map((repo) => {
                const settings = repo.settings || {
                  auto_merge: false,
                  auto_merge_only_test_files: true,
                  merge_method: "merge",
                  updated_at: "",
                  updated_by: "",
                };
                const isSaving = savingRepoId === repo.repoId;

                return (
                  <tr key={repo.repoId} className={isSaving ? "opacity-50" : ""}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{repo.repoName}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          updateSetting(
                            repo.repoId,
                            repo.repoName,
                            "auto_merge",
                            !settings.auto_merge
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          settings.auto_merge ? "bg-pink-600" : "bg-gray-300"
                        }`}
                        disabled={isSaving}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            settings.auto_merge ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          updateSetting(
                            repo.repoId,
                            repo.repoName,
                            "auto_merge_only_test_files",
                            !settings.auto_merge_only_test_files
                          )
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                          settings.auto_merge_only_test_files ? "bg-pink-600" : "bg-gray-300"
                        }`}
                        disabled={isSaving || !settings.auto_merge}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-sm transition-transform ${
                            settings.auto_merge_only_test_files ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={settings.merge_method}
                        onChange={(e) =>
                          updateSetting(repo.repoId, repo.repoName, "merge_method", e.target.value)
                        }
                        className="w-32 p-1.5 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500 text-sm"
                        disabled={isSaving || !settings.auto_merge}
                      >
                        <option value="merge">Merge</option>
                        <option value="squash">Squash</option>
                        <option value="rebase">Rebase</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {repo.settings?.updated_by && repo.settings?.updated_at ? (
                        <>
                          <div>
                            {repo.settings.updated_by.split(":")[1] || repo.settings.updated_by}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(repo.settings.updated_at).toLocaleString()}
                          </div>
                        </>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
