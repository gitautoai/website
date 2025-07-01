"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports (Actions)
import { slackUs } from "@/app/actions/slack/slack-us";
import { getTriggerSettings } from "@/app/actions/supabase/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/save-trigger-settings";
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedule } from "@/app/actions/aws/delete-schedule";

// Local imports (Components and etc.)
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import TriggerToggle from "@/app/settings/components/TriggerToggle";
import type { TriggerSettings } from "@/app/settings/types";

// Local imports (Others)
import { PRODUCT_NAME } from "@/config";
import { convertLocalToUTC } from "@/utils/convert-local-to-utc";
import { convertUTCToLocal } from "@/utils/convert-utc-to-local";

export default function TriggersPage() {
  const {
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    currentRepoId,
    currentRepoName,
    userId,
    userName,
  } = useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [triggerSettings, setTriggerSettings] = useState<TriggerSettings>({
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnPrChange: false,
    triggerOnMerged: false,
    triggerOnSchedule: false,
    scheduleTimeLocal: "09:00",
    scheduleTimeUTC: "",
    scheduleIncludeWeekends: false,
  });
  const [originalScheduleTime, setOriginalScheduleTime] = useState<string>("");

  // Common function to fetch and set trigger settings
  const fetchAndSetTriggerSettings = async () => {
    if (!currentOwnerId || !currentRepoId) return;

    try {
      setIsLoading(true);
      const settings = await getTriggerSettings(currentOwnerId, currentRepoId);

      // If we have UTC time but no local time, convert UTC to local
      if (settings.scheduleTimeUTC && !settings.scheduleTimeLocal) {
        settings.scheduleTimeLocal = convertUTCToLocal(settings.scheduleTimeUTC);
      }

      setTriggerSettings(settings);
    } catch (error) {
      console.error("Failed to fetch trigger settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAndSetTriggerSettings();
  }, [currentOwnerId, currentRepoId]);

  const saveSettings = async (updatedSettings: TriggerSettings) => {
    if (
      !currentOwnerId ||
      !currentOwnerType ||
      !currentOwnerName ||
      !currentRepoId ||
      !currentRepoName ||
      !userId
    )
      return;

    try {
      setIsSaving(true);

      // Save to Supabase first
      await saveTriggerSettings(
        currentOwnerId,
        currentRepoId,
        currentRepoName,
        userId,
        userName,
        updatedSettings
      );

      // Handle AWS scheduling separately
      if (updatedSettings.triggerOnSchedule) {
        await createOrUpdateSchedule({
          ownerId: currentOwnerId,
          ownerType: currentOwnerType,
          ownerName: currentOwnerName,
          repoId: currentRepoId,
          repoName: currentRepoName,
          scheduleTimeUTC: updatedSettings.scheduleTimeUTC,
          includeWeekends: updatedSettings.scheduleIncludeWeekends,
        });
      } else {
        await deleteSchedule(currentOwnerId, currentRepoId);
      }
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
      triggerOnPrChange: "PR Change trigger",
      triggerOnMerged: "Merged trigger",
      triggerOnSchedule: "Schedule trigger",
      scheduleTimeLocal: "Schedule time",
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

    // If schedule is enabled, calculate UTC if it's not calculated yet
    if (key === "triggerOnSchedule" && newValue && !triggerSettings.scheduleTimeUTC) {
      updatedSettings.scheduleTimeUTC = convertLocalToUTC(triggerSettings.scheduleTimeLocal);
    }

    // When enabling triggerOnMerged, disable triggerOnPrChange
    if (key === "triggerOnMerged" && newValue) updatedSettings.triggerOnPrChange = false;

    // When enabling triggerOnPrChange, disable triggerOnMerged
    if (key === "triggerOnPrChange" && newValue) updatedSettings.triggerOnMerged = false;

    setTriggerSettings(updatedSettings);
    saveSettings(updatedSettings);
    notifyChange(key, oldValue, newValue);
  };

  const handleScheduleChange = (
    field: "scheduleTimeLocal" | "scheduleIncludeWeekends",
    value: string | boolean
  ) => {
    let updatedSettings = {
      ...triggerSettings,
      [field]: value,
    };

    if (field === "scheduleTimeLocal" && typeof value === "string") {
      updatedSettings.scheduleTimeUTC = convertLocalToUTC(value);
    }

    setTriggerSettings(updatedSettings);

    // For checkbox changes, save immediately
    if (field === "scheduleIncludeWeekends") {
      saveSettings(updatedSettings);
      notifyChange(field, triggerSettings[field], value);
    }
  };

  const handleTimeBlur = () => {
    // Only save if the time actually changed
    if (triggerSettings.scheduleTimeLocal !== originalScheduleTime) {
      saveSettings(triggerSettings);
      notifyChange("scheduleTimeLocal", originalScheduleTime, triggerSettings.scheduleTimeLocal);
    }
  };

  const handleTimeFocus = () => {
    setOriginalScheduleTime(triggerSettings.scheduleTimeLocal);
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
        <RepositorySelector onRepoChange={fetchAndSetTriggerSettings} />
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
              title="On PR change"
              description={`Triggers ${PRODUCT_NAME} to add unit tests when pull requests are opened, updated, or synchronized in this repository. Cannot be used together with 'On merge' trigger.`}
              isEnabled={triggerSettings.triggerOnPrChange}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnPrChange")}
            />

            <TriggerToggle
              title="On merge"
              description={`Triggers ${PRODUCT_NAME} to add unit tests for code that has been merged into your target branch. Ensures newly merged features have proper test coverage. Cannot be used together with 'On PR change' trigger.`}
              isEnabled={triggerSettings.triggerOnMerged}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnMerged")}
            />

            <div>
              <TriggerToggle
                title="On schedule"
                description="Triggers GitAuto to automatically create a PR to add unit tests at specified times, prioritizing files with the lowest test coverage first."
                isEnabled={triggerSettings.triggerOnSchedule}
                isDisabled={isSaving}
                onToggle={() => handleToggle("triggerOnSchedule")}
              />

              {triggerSettings.triggerOnSchedule && (
                <div className="ml-10 mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="mb-4">
                    <label
                      htmlFor="scheduleTimeLocal"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Daily run time
                    </label>
                    <input
                      type="time"
                      id="scheduleTimeLocal"
                      value={triggerSettings.scheduleTimeLocal}
                      onChange={(e) => handleScheduleChange("scheduleTimeLocal", e.target.value)}
                      onFocus={handleTimeFocus}
                      onBlur={handleTimeBlur}
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
