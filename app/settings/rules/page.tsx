"use client";
// Third-party imports
import { useCallback, useEffect, useState, useRef, useTransition } from "react";

// Local imports
import { getRepositorySettings } from "@/app/actions/supabase/get-repository-settings";
import { saveRepositorySettings } from "@/app/actions/supabase/save-repository-settings";
import { Branch } from "@/app/api/github/get-branches/route";
import { useAccountContext } from "@/app/components/Context/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import SaveButton from "@/app/settings/components/SaveButton";
import { PLAN_LIMITS } from "@/app/settings/constants/plans";
import { RULES_CONTENT } from "@/app/settings/constants/rulesDefaults";
import { RulesSettings } from "@/app/settings/types";
import { countTokens } from "@/utils/tokens";

export default function RulesPage() {
  // Account context
  const {
    currentOwnerId,
    currentOwnerName,
    currentRepoId,
    currentRepoName,
    userId,
    userName,
    accessToken,
  } = useAccountContext();

  // UI states
  const [isLoading, setIsLoading] = useState(false);
  const [isBranchLoading, setIsBranchLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form data
  const [formData, setFormData] = useState<RulesSettings>({
    repoRules: "",
    targetBranch: "",
  });

  // Other state
  const [branches, setBranches] = useState<Branch[]>([]);
  const [tokenCounts, setTokenCounts] = useState<Record<string, number>>({ repoRules: 0 });
  const tokenCountTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load initial settings
  useEffect(() => {
    if (!currentOwnerId || !currentRepoId) {
      setIsLoading(false);
      return;
    }

    const loadFormData = async () => {
      const startTime = performance.now();
      try {
        setError(null);
        setIsLoading(true);
        const data = await getRepositorySettings(currentOwnerId, currentRepoId);
        if (data) {
          const newSettings: RulesSettings = {
            repoRules: data.repo_rules || "",
            targetBranch: data.target_branch || "",
          };
          setFormData(newSettings);
          setTokenCounts({ repoRules: countTokens(newSettings.repoRules) });
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

    loadFormData();
  }, [currentOwnerId, currentRepoId]);

  // Load branches when repository changes
  useEffect(() => {
    if (!currentRepoName || !currentOwnerName || !accessToken) return;

    const fetchBranches = async () => {
      setIsBranchLoading(true);
      try {
        const response = await fetch("/api/github/get-branches", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ownerName: currentOwnerName,
            repoName: currentRepoName,
            accessToken,
          }),
        });

        if (!response.ok) throw new Error("Failed to fetch branches");

        const branchData: Branch[] = await response.json();
        setBranches(branchData);
      } catch (err) {
        console.error("Error loading branches:", err);
      } finally {
        setIsBranchLoading(false);
      }
    };

    fetchBranches();
  }, [currentRepoName, currentOwnerName, accessToken]);

  // Branch selection logic
  useEffect(() => {
    if (branches.length === 0 || isBranchLoading) return;

    // Only set branch if none is selected or current selection is invalid
    if (formData.targetBranch && branches.some((b) => b.name === formData.targetBranch)) return;

    // Fallback to default branch
    const defaultBranch = branches.find((b) => b.isDefault);
    if (defaultBranch) {
      handleFieldChange("targetBranch", defaultBranch.name);
    }
  }, [branches, isBranchLoading]);

  // Field change handler
  const handleFieldChange = useCallback((field: keyof RulesSettings, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Only count tokens for text fields
    if (field === "repoRules") {
      if (tokenCountTimeoutRef.current) {
        clearTimeout(tokenCountTimeoutRef.current);
      }

      tokenCountTimeoutRef.current = setTimeout(() => {
        setTokenCounts((prev) => ({
          ...prev,
          [field]: countTokens(value),
        }));
      }, 500);
    }
  }, []);

  // Save handler
  const handleSave = () => {
    if (!currentOwnerId || !currentRepoId || !currentRepoName || !userId) return;

    setError(null);

    startTransition(async () => {
      try {
        await saveRepositorySettings(
          currentOwnerId,
          currentRepoId,
          currentRepoName,
          userId,
          userName,
          formData
        );
      } catch (error) {
        setError("Failed to save settings. Please try again later.");
        console.error("Error saving settings:", error);
      }
    });
  };

  // Memoized rule section renderer
  const renderRuleSection = useCallback(
    (field: "repoRules") => (
      <div className="mb-8 relative">
        <h2 className="text-xl font-semibold">{RULES_CONTENT[field].title}</h2>
        <p className="text-gray-600 text-sm mb-2">{RULES_CONTENT[field].description}</p>
        <div className="relative">
          <textarea
            value={formData.repoRules}
            onChange={(e) => handleFieldChange("repoRules", e.target.value)}
            placeholder={RULES_CONTENT.repoRules.placeholder}
            maxLength={PLAN_LIMITS.STANDARD.maxChars}
            rows={10}
            disabled={isPending || isLoading}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-600"
          />
          {isPending && (
            <div className="absolute right-2 top-2">
              <div className="w-4 h-4 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
        <div className="mt-2 text-sm text-gray-500 flex gap-2">
          <span
            className={`px-2 py-1 rounded ${
              formData.repoRules.length > PLAN_LIMITS.STANDARD.maxChars
                ? "bg-red-100 text-red-700"
                : "bg-gray-100"
            }`}
          >
            {formData.repoRules.length} / {PLAN_LIMITS.STANDARD.maxChars} characters
          </span>
          <span className="px-2 py-1 rounded bg-gray-100">{tokenCounts.repoRules} tokens</span>
        </div>
      </div>
    ),
    [formData, handleFieldChange, isPending, isLoading, tokenCounts]
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

      {/* Branch selector */}
      <div className="mt-4 mb-6 w-48">
        <label className="block text-sm font-medium text-gray-700 mb-2">Target Branch</label>
        <select
          value={formData.targetBranch}
          onChange={(e) => handleFieldChange("targetBranch", e.target.value)}
          className={`w-full p-2 border rounded-lg ${isBranchLoading ? "bg-gray-100" : "bg-white"}`}
          disabled={isBranchLoading || !currentRepoName || !currentOwnerName}
        >
          <option value="">Select Branch</option>
          {branches.map((branch) => (
            <option key={branch.name} value={branch.name}>
              {branch.name} {branch.isDefault ? "(default)" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-6">
        {renderRuleSection("repoRules")}
        <div className="mt-6">
          <SaveButton onClick={handleSave} isSaving={isPending} />
        </div>
      </div>

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
