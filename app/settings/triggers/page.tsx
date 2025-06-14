"use client";

// Third-party imports
import { useEffect, useState } from "react";

// Local imports
import { useAccountContext } from "@/app/components/Context/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import TriggerToggle from "@/app/settings/components/TriggerToggle";
import { triggersJsonLd } from "@/app/settings/triggers/jsonld";
import type { TriggerSettings } from "@/app/settings/types";
import { slackUs } from "@/lib/slack/slackUs";

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

  const fetchSettings = async () => {
    if (!currentOwnerId || !currentRepoId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `/api/supabase/get-trigger-settings?ownerId=${currentOwnerId}&repoId=${currentRepoId}`
      );
      if (response.ok) {
        const data = await response.json();

        // Extract time with direct value
        let scheduleTime = "09:00";

        if (data.schedule_time) {
          // If schedule time is in "HH:MM:SS+00" format
          if (typeof data.schedule_time === "string" && data.schedule_time.includes(":")) {
            // Use only the first two parts to get "HH:MM" format
            const parts = data.schedule_time.split(":");
            if (parts.length >= 2) {
              scheduleTime = `${parts[0].padStart(2, "0")}:${parts[1].padStart(2, "0")}`;
            }
          }
        }

        setTriggerSettings({
          triggerOnReviewComment: data.trigger_on_review_comment || false,
          triggerOnTestFailure: data.trigger_on_test_failure || false,
          triggerOnCommit: data.trigger_on_commit || false,
          triggerOnMerged: data.trigger_on_merged || false,
          triggerOnSchedule: data.trigger_on_schedule || false,
          scheduleTime: scheduleTime || "09:00", // 常に値が存在することを保証
          scheduleIncludeWeekends: data.schedule_include_weekends || false,
        });
      }
    } catch (error) {
      console.error("Failed to fetch trigger settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [currentOwnerId, currentRepoId]);

  const saveSettings = async (updatedSettings: TriggerSettings) => {
    if (!currentOwnerId || !currentRepoId || !userId) return;

    try {
      setIsSaving(true);

      // Parse the time string to get hours and minutes
      let scheduleHours = 12;
      let scheduleMinutes = 0;

      if (updatedSettings.scheduleTime) {
        const [hours, minutes] = updatedSettings.scheduleTime.split(":").map(Number);
        scheduleHours = hours;
        scheduleMinutes = minutes;
      }

      const response = await fetch("/api/supabase/save-trigger-settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: currentOwnerId,
          repoId: currentRepoId,
          repoName: currentRepoName,
          userId,
          userName,
          triggerOnReviewComment: updatedSettings.triggerOnReviewComment,
          triggerOnTestFailure: updatedSettings.triggerOnTestFailure,
          triggerOnCommit: updatedSettings.triggerOnCommit,
          triggerOnMerged: updatedSettings.triggerOnMerged,
          triggerOnSchedule: updatedSettings.triggerOnSchedule,
          scheduleFrequency: "daily",
          scheduleTime: updatedSettings.scheduleTime,
          scheduleIncludeWeekends: updatedSettings.scheduleIncludeWeekends,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save trigger settings");
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
    const updatedSettings = {
      ...triggerSettings,
      [key]: newValue,
    };
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
    fetchSettings();
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(triggersJsonLd) }}
      />
      <div className="relative min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-left">Trigger settings</h1>

        <div className="mb-6">
          <RepositorySelector onRepoChange={handleRepoChange} />
        </div>

        <p className="mb-6 text-gray-600">
          These settings control when GitAuto will automatically analyze your code and generate
          tests. Each trigger can be enabled independently.
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
                title="(WIP) On commit"
                description="Triggers GitAuto to add unit tests when commits are made by users in this repository. Not triggered by GitAuto's own commits to avoid recursive automation."
                isEnabled={triggerSettings.triggerOnCommit}
                isDisabled={isSaving}
                onToggle={() => handleToggle("triggerOnCommit")}
              />

              <TriggerToggle
                title="(WIP) On merge"
                description="Triggers GitAuto to add unit tests for code that has been merged into your target branch. Ensures newly merged features have proper test coverage."
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
    </>
  );
}
