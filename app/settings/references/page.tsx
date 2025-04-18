"use client";
// Third-party imports
import { useEffect, useState, useCallback } from "react";

// Local imports
import RepositorySelector from "../components/RepositorySelector";
import { PLAN_LIMITS } from "../constants/plans";
import SaveButton from "../components/SaveButton";
import { ReferenceSettings } from "../types";
import { useAccountContext } from "@/components/Context/Account";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ReferencesPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const {
    currentOwnerId,
    currentOwnerName,
    currentRepoName,
    loadSettings,
    saveSettings,
  } = useAccountContext();
  const [settings, setSettings] = useState<ReferenceSettings>({
    webUrls: [""],
    filePaths: [""],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [urlValidationStatus, setUrlValidationStatus] = useState<
    Record<number, "checking" | "valid" | "invalid" | null>
  >({});
  const [filePathValidationStatus, setFilePathValidationStatus] = useState<
    Record<number, "checking" | "valid" | "invalid" | null>
  >({});

  // Load initial settings
  useEffect(() => {
    const handleLoadSettings = async () => {
      const startTime = performance.now();
      if (!currentRepoName || !currentOwnerName) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        const data = await loadSettings(currentOwnerName, currentRepoName);
        console.log("Loaded data: ", data);
        if (data) {
          setSettings({
            webUrls:
              Array.isArray(data.web_urls) && data.web_urls.length > 0 ? data.web_urls : [""],
            filePaths:
              Array.isArray(data.file_paths) && data.file_paths.length > 0 ? data.file_paths : [""],
          });
        } else {
          // Handle 404 or no data case
          setSettings({
            webUrls: [""],
            filePaths: [""],
          });
        }
      } catch (error) {
        setError("Failed to load settings. Using default values.");
      } finally {
        setIsLoading(false);
        const endTime = performance.now();
        console.log(`References page loadSettings time: ${endTime - startTime}ms`);
      }
    };

    handleLoadSettings();
  }, [currentRepoName, currentOwnerName]);

  // Remove debounced save and replace with explicit save
  const handleChange = useCallback((newSettings: Partial<ReferenceSettings>) => {
    setSettings((prev: ReferenceSettings) => ({ ...prev, ...newSettings }));
  }, []);

  // Add URL validation function
  const validateUrl = useCallback(async (url: string, index: number) => {
    if (!url.trim() || !url.startsWith("https://")) {
      setUrlValidationStatus((prev) => ({ ...prev, [index]: null }));
      return;
    }

    setUrlValidationStatus((prev) => ({ ...prev, [index]: "checking" }));

    try {
      const response = await fetch("/api/validate-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        setUrlValidationStatus((prev) => ({ ...prev, [index]: "valid" }));
      } else {
        setUrlValidationStatus((prev) => ({ ...prev, [index]: "invalid" }));
      }
    } catch (error) {
      console.error("Error validating URL:", error);
      setUrlValidationStatus((prev) => ({ ...prev, [index]: "invalid" }));
    }
  }, []);

  // Add file path validation function
  const validateFilePath = useCallback(
    async (path: string, index: number) => {
      if (!path.trim() || !currentRepoName) {
        setFilePathValidationStatus((prev) => ({ ...prev, [index]: null }));
        return;
      }

      setFilePathValidationStatus((prev) => ({ ...prev, [index]: "checking" }));

      try {
        // First get the installation ID for this owner
        const installResponse = await fetch(
          `/api/supabase/get-installation-id?ownerId=${currentOwnerId}`
        );
        if (!installResponse.ok) {
          throw new Error("Failed to get installation ID");
        }

        const { installationId } = await installResponse.json();
        if (!installationId) {
          throw new Error("Installation ID not found");
        }

        // Now validate the file path with the installation ID
        const response = await fetch("/api/validate-file-path", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            owner: currentOwnerName,
            repo: currentRepoName,
            path,
            installationId,
          }),
        });

        if (response.ok) {
          setFilePathValidationStatus((prev) => ({ ...prev, [index]: "valid" }));
        } else {
          setFilePathValidationStatus((prev) => ({ ...prev, [index]: "invalid" }));
        }
      } catch (error) {
        console.error("Error validating file path:", error);
        setFilePathValidationStatus((prev) => ({ ...prev, [index]: "invalid" }));
      }
    },
    [currentRepoName, currentOwnerName, currentOwnerId]
  );

  // Update canSave to check file paths too
  const canSave = useCallback(() => {
    // Get non-empty URLs and file paths
    const urls = settings.webUrls.filter((url) => url.trim() !== "");
    const paths = settings.filePaths.filter((path) => path.trim() !== "");

    // If there are no URLs or paths, meaning users want to remove all references, we can save
    if (urls.length === 0 && paths.length === 0) return true;

    // Check if any URLs are invalid
    const hasInvalidUrls = urls.some((url, index) => urlValidationStatus[index] === "invalid");

    // Check if any paths are invalid
    const hasInvalidPaths = paths.some(
      (path, index) => filePathValidationStatus[index] === "invalid"
    );

    // Allow saving if nothing is explicitly invalid
    return !hasInvalidUrls && !hasInvalidPaths;
  }, [settings.webUrls, settings.filePaths, urlValidationStatus, filePathValidationStatus]);

  // Handle save with URL validation
  const handleSave = useCallback(async () => {
    if (!currentOwnerName || !currentRepoName) return;

    // Check if all URLs are valid before saving
    if (!canSave()) {
      setError("Some URLs or file paths are not accessible. Please check and try again.");
      return;
    }

    setIsSaving(true);
    setError(null);
    const startTime = performance.now();

    try {
      // Ensure arrays are never empty strings
      const webUrls = settings.webUrls?.filter((url) => url !== "") || [];
      const filePaths = settings.filePaths?.filter((path) => path !== "") || [];

      const result = await saveSettings({ webUrls, filePaths });

      if (!result) throw new Error("Failed to save settings");
    } catch (error) {
      setError("Failed to save settings. Please try again later.");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
      const endTime = performance.now();
      console.log(`References page saveSettings time: ${endTime - startTime}ms`);
    }
  }, [currentOwnerName, currentRepoName, saveSettings, settings, canSave]);

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Reference Settings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <RepositorySelector />

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Reference URLs</h2>
          <p className="text-gray-600 text-sm mb-4">
            Add public documentation URLs (HTTPS only). Pages requiring authentication are not
            supported.
          </p>

          <div className="space-y-3">
            {settings.webUrls.map((url, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => {
                      const newUrls = [...settings.webUrls];
                      newUrls[index] = e.target.value;
                      handleChange({ webUrls: newUrls });
                      // Reset validation status when URL changes
                      setUrlValidationStatus((prev) => ({ ...prev, [index]: null }));
                    }}
                    onBlur={(e) => {
                      const newUrls = [...settings.webUrls];
                      // Remove query parameters but keep the path
                      const trimmedUrl = e.target.value.trim().split("?")[0];
                      newUrls[index] = trimmedUrl;
                      handleChange({ webUrls: newUrls });

                      // Validate URL on blur if it's not empty
                      if (trimmedUrl) {
                        validateUrl(trimmedUrl, index);
                      }
                    }}
                    placeholder="https://docs.example.com"
                    className="w-full p-2 border rounded"
                    pattern="https://.*"
                    disabled={isSaving || isLoading}
                  />
                  {urlValidationStatus[index] && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {urlValidationStatus[index] === "checking" && (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                      )}
                      {urlValidationStatus[index] === "valid" && (
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {urlValidationStatus[index] === "invalid" && (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {settings.webUrls.length > 1 && (
                  <button
                    onClick={() => {
                      if (settings.webUrls.length <= 1) {
                        handleChange({ webUrls: [""] });
                        return;
                      }
                      const newUrls = settings.webUrls.filter((_, i) => i !== index);
                      // Also remove validation status for this index
                      setUrlValidationStatus((prev) => {
                        const newStatus = { ...prev };
                        delete newStatus[index];
                        // Reindex the remaining statuses
                        const reindexed: typeof newStatus = {};
                        Object.keys(newStatus).forEach((key) => {
                          const keyNum = parseInt(key);
                          if (keyNum > index) {
                            reindexed[keyNum - 1] = newStatus[keyNum];
                          } else {
                            reindexed[keyNum] = newStatus[keyNum];
                          }
                        });
                        return reindexed;
                      });
                      handleChange({ webUrls: newUrls });
                    }}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    disabled={isSaving || isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (!settings.webUrls?.length) return;
              if (settings.webUrls.length >= PLAN_LIMITS.STANDARD.maxUrls) return;
              const lastUrl = settings.webUrls[settings.webUrls.length - 1];
              if (!lastUrl?.trim()) return;
              handleChange({ webUrls: [...settings.webUrls, ""] });
            }}
            disabled={
              !settings.webUrls?.length ||
              settings.webUrls.length >= PLAN_LIMITS.STANDARD.maxUrls ||
              !settings.webUrls[settings.webUrls.length - 1]?.trim() ||
              isSaving ||
              isLoading
            }
            className="mt-3 px-4 py-2 bg-pink-50 text-pink-600 rounded hover:bg-pink-100 disabled:opacity-50"
          >
            Add URL
          </button>

          <div className="mt-2 text-sm text-gray-500">
            {settings.webUrls.length} / {PLAN_LIMITS.STANDARD.maxUrls} URLs
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Reference File Paths</h2>
          <p className="text-gray-600 text-sm mb-4">
            Add relative file paths to important files (e.g., docs/api.md, src/config.js,
            CONTRIBUTING.md)
          </p>

          <div className="space-y-3">
            {settings.filePaths.map((path, index) => (
              <div key={index} className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={path}
                    onChange={(e) => {
                      const newPaths = [...settings.filePaths];
                      newPaths[index] = e.target.value;
                      handleChange({ filePaths: newPaths });
                      // Reset validation status when path changes
                      setFilePathValidationStatus((prev) => ({ ...prev, [index]: null }));
                    }}
                    onBlur={(e) => {
                      const newPaths = [...settings.filePaths];
                      const trimmedPath = e.target.value.trim();
                      newPaths[index] = trimmedPath;
                      handleChange({ filePaths: newPaths });

                      // Validate path on blur if it's not empty
                      if (trimmedPath) {
                        validateFilePath(trimmedPath, index);
                      }
                    }}
                    placeholder="path/to/file.ext"
                    className="w-full p-2 border rounded"
                    disabled={isSaving || isLoading}
                  />
                  {filePathValidationStatus[index] && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {filePathValidationStatus[index] === "checking" && (
                        <div className="animate-spin h-4 w-4 border-2 border-gray-500 rounded-full border-t-transparent"></div>
                      )}
                      {filePathValidationStatus[index] === "valid" && (
                        <svg
                          className="h-5 w-5 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                      {filePathValidationStatus[index] === "invalid" && (
                        <svg
                          className="h-5 w-5 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {settings.filePaths.length > 1 && (
                  <button
                    onClick={() => {
                      if (settings.filePaths.length <= 1) {
                        handleChange({ filePaths: [""] });
                        return;
                      }
                      const newPaths = settings.filePaths.filter((_, i) => i !== index);
                      handleChange({ filePaths: newPaths });
                    }}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100"
                    disabled={isSaving || isLoading}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={() => {
              if (!settings.filePaths?.length) return;
              if (settings.filePaths.length >= PLAN_LIMITS.STANDARD.maxPaths) return;
              const lastPath = settings.filePaths[settings.filePaths.length - 1];
              if (!lastPath?.trim()) return;
              handleChange({ filePaths: [...settings.filePaths, ""] });
            }}
            disabled={
              !settings.filePaths?.length ||
              settings.filePaths.length >= PLAN_LIMITS.STANDARD.maxPaths ||
              !settings.filePaths[settings.filePaths.length - 1]?.trim() ||
              isSaving ||
              isLoading
            }
            className="mt-3 px-4 py-2 bg-pink-50 text-pink-600 rounded hover:bg-pink-100 disabled:opacity-50"
          >
            Add Path
          </button>

          <div className="mt-2 text-sm text-gray-500">
            <div>
              {settings.filePaths.length} / {PLAN_LIMITS.STANDARD.maxPaths} paths
            </div>
            <div className="text-xs mt-1">
              System paths (always included): .gitignore, package.json, README.md
            </div>
          </div>
        </div>

        <div className="mt-6">
          <SaveButton
            onClick={handleSave}
            isSaving={isSaving}
            disabled={!canSave() || isLoading || isSaving}
          />
          {settings.webUrls.some(
            (url, index) => url.trim() !== "" && urlValidationStatus[index] === "invalid"
          ) && (
            <div className="mt-2 text-sm text-red-500">
              Some URLs are not accessible. Please check and fix them before saving.
            </div>
          )}
          {settings.filePaths.some(
            (path, index) => path.trim() !== "" && filePathValidationStatus[index] === "invalid"
          ) && (
            <div className="mt-2 text-sm text-red-500">
              Some file paths don&apos;t exist in the repository. Please check and fix them before
              saving.
            </div>
          )}
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
