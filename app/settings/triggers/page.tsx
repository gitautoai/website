"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports
import { slackUs } from "@/app/actions/slack/slack-us";
import { getTriggerSettings } from "@/app/actions/supabase/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/save-trigger-settings";
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import TriggerToggle from "@/app/settings/components/TriggerToggle";
import type { TriggerSettings } from "@/app/settings/types";
import { PRODUCT_NAME } from "@/config";

export default function TriggersPage() {
  const { currentOwnerId, currentOwnerName, currentRepoId, currentRepoName, userId, userName } =
    useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [triggerSettings, setTriggerSettings] = useState<TriggerSettings>({
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnMerged: false,
    triggerOnSchedule: false,
    scheduleTime: "09:00",
    scheduleIncludeWeekends: false,
  });

  useEffect(() => {
    if (!currentOwnerId || !currentRepoId) return;

    (async () => {
      try {
        setIsLoading(true);
        const settings = await getTriggerSettings(currentOwnerId, currentRepoId);
        setTriggerSettings(settings);
      } catch (error) {
        console.error("Failed to fetch trigger settings:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentOwnerId, currentRepoId]);

  const saveSettings = async (updatedSettings: TriggerSettings) => {
    if (!currentOwnerId || !currentRepoId || !currentRepoName || !userId) return;

    try {
      setIsSaving(true);
      await saveTriggerSettings(
        currentOwnerId,
        currentRepoId,
        currentRepoName,
        userId,
        userName,
        updatedSettings
      );
    } catch (error) {
      console.error("Error saving trigger settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const notifyChange = async (key: string, oldValue: any, newValue: any) => {
    // Convert setting name to a readable format
    const settingLabels: Record<string, string> = {
      triggerOnReviewComment: "Review Comment trigger",
      triggerOnTestFailure: "Test Failure trigger",
      triggerOnCommit: "Commit trigger",
      triggerOnMerged: "Merged trigger",
      triggerOnSchedule: "Schedule trigger",
      scheduleTime: "Schedule time",
      scheduleIncludeWeekends: "Include weekends",
    };

    const readableSetting = settingLabels[key] || key;

    // Build the message
    const message = `${userName} (${userId}) updated ${readableSetting} from ${oldValue} to ${newValue} for ${currentOwnerName}/${currentRepoName}`;

    // Call the server action
    await slackUs(message);
  };

  const handleToggle = (key: keyof TriggerSettings) => {
    const oldValue = triggerSettings[key];
    const newValue = !oldValue;

    let updatedSettings = {
      ...triggerSettings,
      [key]: newValue,
    };

    // When enabling triggerOnCommit, disable triggerOnMerged
    if (key === "triggerOnCommit" && newValue) updatedSettings.triggerOnMerged = false;

    // When enabling triggerOnMerged, disable triggerOnCommit
    if (key === "triggerOnMerged" && newValue) updatedSettings.triggerOnCommit = false;

    setTriggerSettings(updatedSettings);
    saveSettings(updatedSettings);
    notifyChange(key, oldValue, newValue);
  };

  const handleScheduleChange = (
    field: "scheduleTime" | "scheduleIncludeWeekends",
    value: string | boolean
  ) => {
    const oldValue = triggerSettings[field];
    const updatedSettings = {
      ...triggerSettings,
      [field]: value,
    };
    setTriggerSettings(updatedSettings);
    saveSettings(updatedSettings);
    notifyChange(field, oldValue, value);
  };

  const handleRepoChange = () => {
    if (!currentOwnerId || !currentRepoId) return;

    (async () => {
      try {
        setIsLoading(true);
        const settings = await getTriggerSettings(currentOwnerId, currentRepoId);
        setTriggerSettings(settings);
      } catch (error) {
        console.error("Failed to fetch trigger settings:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  };

  // Function to get timezone information
  const getTimezoneInfo = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      // Calculate offset from UTC (e.g., UTC+9)
      const now = new Date();
      const offset = -now.getTimezoneOffset() / 60;
      const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;

      return `${timezone} (${offsetStr})`;
    } catch (e) {
      return "your local timezone";
    }
  };

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-left">Trigger settings</h1>

      <div className="mb-6">
        <RepositorySelector onRepoChange={handleRepoChange} />
      </div>

      <p className="mb-6 text-gray-600">
        These settings control when GitAuto will automatically analyze your code and generate tests.
        Each trigger can be enabled independently.
      </p>

      <div className="relative rounded-lg">
        <div className="space-y-4">
          <h2 className="text-xl font-medium mt-10 mb-2 text-left">Trigger type</h2>

          <div className="space-y-3">
            <TriggerToggle
              title="On review comment"
              description="Triggers GitAuto to respond to review comments on GitAuto-created PRs by automatically creating fix commits. Not triggered by comments on PRs created by others."
              isEnabled={triggerSettings.triggerOnReviewComment}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnReviewComment")}
            />

            <TriggerToggle
              title="On test failure"
              description="Triggers GitAuto to automatically create a fix commit when a CI test fails on a GitAuto-created PR. Not triggered by test failures on PRs created by others."
              isEnabled={triggerSettings.triggerOnTestFailure}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnTestFailure")}
            />

            <TriggerToggle
              title="On push"
              description={`Triggers ${PRODUCT_NAME} to add unit tests when commits are made by users in this repository. Not triggered by ${PRODUCT_NAME} or other bots' commits to avoid recursive automation. Cannot be used together with 'On merge' trigger.`}
              isEnabled={triggerSettings.triggerOnCommit}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnCommit")}
            />

            <TriggerToggle
              title="On merge"
              description={`Triggers ${PRODUCT_NAME} to add unit tests for code that has been merged into your target branch. Ensures newly merged features have proper test coverage. Cannot be used together with 'On push' trigger.`}
              isEnabled={triggerSettings.triggerOnMerged}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnMerged")}
            />

            <div>
              <TriggerToggle
                title="(WIP) On schedule"
                description="Triggers GitAuto to automatically create a PR to add unit tests at specified times, prioritizing files with the lowest test coverage first."
                isEnabled={triggerSettings.triggerOnSchedule}
                isDisabled={isSaving}
                onToggle={() => handleToggle("triggerOnSchedule")}
              />

              {triggerSettings.triggerOnSchedule && (
                <div className="ml-10 mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-4">
                    <label
                      htmlFor="scheduleTime"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Daily run time
                    </label>
                    <input
                      type="time"
                      id="scheduleTime"
                      value={triggerSettings.scheduleTime}
                      onChange={(e) => handleScheduleChange("scheduleTime", e.target.value)}
                      className="w-40 p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      disabled={isSaving}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Time is based on {getTimezoneInfo()}
                    </p>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="includeWeekends"
                      checked={triggerSettings.scheduleIncludeWeekends}
                      onChange={(e) =>
                        handleScheduleChange("scheduleIncludeWeekends", e.target.checked)
                      }
                      className="h-4 w-4 text-pink-600 rounded border-gray-300"
                      disabled={isSaving}
                    />
                    <label htmlFor="includeWeekends" className="ml-2 block text-sm text-gray-700">
                      Include weekends
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {(isLoading || isSaving) && <LoadingSpinner />}
    </div>
  );
}
