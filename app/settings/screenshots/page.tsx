"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import type { ScreenshotSettingsType } from "../types";
import RepositorySelector from "../components/RepositorySelector";
import { useGitHub } from "@/components/Context/GitHub";
import LoadingSpinner from "../components/LoadingSpinner";
import { PLAN_LIMITS } from "../constants/plans";
import SaveButton from "../components/SaveButton";

export default function ScreenshotsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedRepo, organizations, loadSettings, saveSettings } = useGitHub();
  const [settings, setSettings] = useState<ScreenshotSettingsType>({
    useScreenshots: false,
    productionUrl: "",
    localPort: "8080",
    startupCommands: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load initial settings
  useEffect(() => {
    const handleLoadSettings = async () => {
      const startTime = performance.now();
      if (!selectedRepo || !organizations.length) {
        setIsLoading(false);
        return;
      }

      const currentOrg = organizations.find((org) =>
        org.repositories.some((repo) => repo.repoName === selectedRepo)
      );
      if (!currentOrg) {
        setIsLoading(false);
        return;
      }

      try {
        setError(null);
        setIsLoading(true);
        const data = await loadSettings(currentOrg.ownerName, selectedRepo);
        if (data) {
          setSettings({
            useScreenshots: data.use_screenshots || false,
            productionUrl: data.production_url || "",
            localPort: data.local_port || "8080",
            startupCommands: Array.isArray(data.startup_commands)
              ? data.startup_commands.join("\n")
              : "",
          });
        } else {
          setSettings({
            useScreenshots: false,
            productionUrl: "",
            localPort: "8080",
            startupCommands: "",
          });
        }
      } catch (error) {
        setError("Failed to load settings. Using default values.");
      } finally {
        setIsLoading(false);
        const endTime = performance.now();
        console.log(`Screenshots page loadSettings time: ${endTime - startTime}ms`);
      }
    };

    handleLoadSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRepo, organizations]);

  const handleChange = useCallback((field: keyof ScreenshotSettingsType, value: any) => {
    // Update state immediately without saving
    setSettings((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSave = useCallback(async () => {
    const currentOrg = organizations.find((org) =>
      org.repositories.some((repo) => repo.repoName === selectedRepo)
    );
    if (!currentOrg || !selectedRepo) return;

    setIsSaving(true);
    setError(null);
    const startTime = performance.now();

    try {
      const result = await saveSettings(currentOrg.ownerName, selectedRepo, settings, "screenshot");

      if (!result) throw new Error("Failed to save settings");
    } catch (error) {
      setError("Failed to save settings. Please try again later.");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
      const endTime = performance.now();
      console.log(`Screenshots page saveSettings time: ${endTime - startTime}ms`);
    }
  }, [organizations, saveSettings, selectedRepo, settings]);

  const isValidPort = (port: string) => {
    // 0~1023 are system ports. 2^16 - 1 = 65535
    const portNum = parseInt(port);
    return portNum >= 1024 && portNum <= 65535;
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Screenshot Settings</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <RepositorySelector />

      <div className="space-y-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Screenshot Evidence</h2>
          <p className="text-gray-600 text-sm mb-4">
            Configure settings for automated screenshot comparisons
          </p>

          <div className="flex items-center space-x-2 mb-6">
            <input
              type="checkbox"
              checked={settings.useScreenshots}
              onChange={(e) => handleChange("useScreenshots", e.target.checked)}
              disabled={!PLAN_LIMITS.PREMIUM.canUseScreenshots || isSaving || isLoading}
              className="h-4 w-4"
            />
            <span>
              Enable Screenshot Evidence
              {!PLAN_LIMITS.PREMIUM.canUseScreenshots && (
                <span className="text-sm text-gray-500 ml-2">(Available in Premium plan)</span>
              )}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Production URL (Before)</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={settings.productionUrl}
                onChange={(e) => {
                  const url = e.target.value.trim().replace(/\/$/, "").split("?")[0];
                  handleChange("productionUrl", url);
                }}
                onBlur={(e) => {
                  const url = e.target.value.trim().replace(/\/$/, "").split("?")[0];
                  handleChange("productionUrl", url);
                }}
                className="w-full p-2 border rounded"
                pattern="https://.*"
                disabled={isSaving || isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Domain only, trailing slash and query parameters will be removed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Local Port (After)</label>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">http://localhost:</span>
                <input
                  type="number"
                  value={settings.localPort}
                  onChange={(e) => {
                    const value = e.target.value;
                    handleChange("localPort", value);
                  }}
                  className="w-24 p-2 border rounded"
                  min="1024"
                  max="65535"
                  disabled={isSaving || isLoading}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">Port must be between 1024 and 65535</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Startup Commands</label>
              <textarea
                value={settings.startupCommands}
                onChange={(e) => {
                  handleChange("startupCommands", e.target.value);
                }}
                placeholder="npm install\nnpm run dev"
                className="w-full p-2 border rounded min-h-[100px]"
                rows={5}
                disabled={isSaving || isLoading}
              />
              <p className="text-sm text-gray-500 mt-1">
                Commands to start your local development server
              </p>
            </div>

            <div className="mt-6">
              <SaveButton onClick={handleSave} isSaving={isSaving} />
            </div>
          </div>
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
