"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import type { RulesSettingsType } from "../types";
import RepositorySelector from "../components/RepositorySelector";
import LoadingSpinner from "../components/LoadingSpinner";
import { RULES_CONTENT } from "../constants/rulesDefaults";
import { countTokens } from "@/utils/tokens";
import { PLAN_LIMITS } from "../constants/plans";
import SaveButton from "../components/SaveButton";
import { useAccountContext } from "@/components/Context/Account";

export default function RulesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentRepoName, currentOwnerName, loadSettings, saveSettings } = useAccountContext();
  const [settings, setSettings] = useState<RulesSettingsType>({
    orgRules: "",
    repoRules: "",
    userRules: "",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [tokenCounts, setTokenCounts] = useState<Record<string, number>>({
    orgRules: 0,
    repoRules: 0,
    userRules: 0,
  });
  const tokenCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
        if (data) {
          const newSettings = {
            orgRules: data.org_rules || "",
            repoRules: data.repo_rules || "",
            userRules: data.user_rules || "",
          };
          setSettings(newSettings);
          setTokenCounts({
            orgRules: countTokens(newSettings.orgRules),
            repoRules: countTokens(newSettings.repoRules),
            userRules: countTokens(newSettings.userRules),
          });
        }
      } catch (error) {
        setError("Failed to load settings");
        console.error("Error loading settings:", error);
      } finally {
        setIsLoading(false);
        const endTime = performance.now();
        console.log(`Rules page loadSettings time: ${endTime - startTime}ms`);
      }
    };

    handleLoadSettings();
  }, [currentRepoName, currentOwnerName]);

  // Remove debounced save and replace with explicit save
  const handleChange = useCallback((field: keyof RulesSettingsType, value: string) => {
    setSettings((prev) => ({ ...prev, [field]: value }));

    // Debounce token counting to reduce performance impact while typing
    if (tokenCountTimeoutRef.current) {
      clearTimeout(tokenCountTimeoutRef.current);
    }

    tokenCountTimeoutRef.current = setTimeout(() => {
      setTokenCounts((prev) => ({
        ...prev,
        [field]: countTokens(value),
      }));
    }, 500);
  }, []);

  const handleSave = useCallback(async () => {
    if (!currentOwnerName || !currentRepoName) return;

    setIsSaving(true);
    setError(null);
    const startTime = performance.now();

    try {
      const result = await saveSettings(currentOwnerName, currentRepoName, settings, "rules");

      if (!result) throw new Error("Failed to save settings");
    } catch (error) {
      setError("Failed to save settings. Please try again later.");
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
      const endTime = performance.now();
      console.log(`Rules page saveSettings time: ${endTime - startTime}ms`);
    }
  }, [currentOwnerName, currentRepoName, saveSettings, settings]);

  const renderRuleSection = useCallback(
    (field: keyof typeof RULES_CONTENT) => (
      <div className="mb-8 relative">
        <h2 className="text-xl font-semibold">{RULES_CONTENT[field].title}</h2>
        <p className="text-gray-600 text-sm mb-2">{RULES_CONTENT[field].description}</p>
        <div className="relative">
          <textarea
            value={settings[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            placeholder={RULES_CONTENT[field].placeholder}
            maxLength={PLAN_LIMITS.STANDARD.maxChars}
            rows={10}
            disabled={isSaving || isLoading}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          {isSaving && (
            <div className="absolute right-2 top-2">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500 flex gap-2">
          <span
            className={`px-2 py-1 rounded ${
              settings[field].length > PLAN_LIMITS.STANDARD.maxChars
                ? "bg-red-100 text-red-700"
                : "bg-gray-100"
            }`}
          >
            {settings[field].length} / {PLAN_LIMITS.STANDARD.maxChars} characters
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">{tokenCounts[field]} tokens</span>
        </div>
      </div>
    ),
    [settings, handleChange, isSaving, isLoading, tokenCounts]
  );

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Rules Settings</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      <RepositorySelector />

      <div className="space-y-6">
        {/* {renderRuleSection("orgRules")} */}
        {renderRuleSection("repoRules")}
        {/* {renderRuleSection("userRules")} */}

        <div className="mt-6">
          <SaveButton onClick={handleSave} isSaving={isSaving} />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
