"use client";

// Third-party imports
import Link from "next/link";
import { useEffect, useState } from "react";

// Local imports (Actions)
import { slackUs } from "@/app/actions/slack/slack-us";
import { getTriggerSettings } from "@/app/actions/supabase/repositories/get-trigger-settings";
import { saveTriggerSettings } from "@/app/actions/supabase/repositories/save-trigger-settings";
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedules } from "@/app/actions/aws/delete-schedules";

// Local imports (Components and etc.)
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import TriggerToggle from "@/app/settings/components/TriggerToggle";
import type { TriggerSettings } from "@/app/settings/types";

// Local imports (Others)
import { PRODUCT_NAME } from "@/config";
import { RELATIVE_URLS } from "@/config/urls";
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
    userLogin,
    userName,
    currentInstallationId,
  } = useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [triggerSettings, setTriggerSettings] = useState<TriggerSettings>({
    triggerOnReviewComment: true,
    triggerOnTestFailure: true,
    triggerOnCommit: false,
    triggerOnPrChange: true,
    triggerOnMerged: false,
    triggerOnSchedule: false,
    scheduleTimeLocal: "09:00",
    scheduleTimeUTC: "",
    scheduleIncludeWeekends: false,
    scheduleExecutionCount: 1,
    scheduleIntervalMinutes: 15,
  });
  const [originalScheduleTime, setOriginalScheduleTime] = useState<string>("");

  const MAX_EXECUTIONS = 12; // Up to 12 times per day
  const ALLOWED_INTERVALS = [5, 10, 15, 20, 30, 60]; // minutes

  // Common function to fetch and set trigger settings
  const fetchAndSetTriggerSettings = async () => {
    if (!currentOwnerId || !currentRepoId) return;

    try {
      setIsLoading(true);
      const settings = await getTriggerSettings(currentOwnerId, currentRepoId);

      if (settings.scheduleTimeUTC && !settings.scheduleTimeLocal) {
        settings.scheduleTimeLocal = convertUTCToLocal(settings.scheduleTimeUTC);
      } else if (!settings.scheduleTimeUTC && !settings.scheduleTimeLocal) {
        settings.scheduleTimeLocal = "09:00";
      }

      setTriggerSettings(settings);
    } catch (error) {
      console.error("Failed to fetch trigger settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!currentOwnerId || !currentRepoId) {
      setIsLoading(false);
      return;
    }
    fetchAndSetTriggerSettings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentOwnerId, currentRepoId]);

  const saveSettings = async (updatedSettings: TriggerSettings) => {
    if (
      !currentOwnerId ||
      !currentOwnerType ||
      !currentOwnerName ||
      !currentRepoId ||
      !currentRepoName ||
      !userId ||
      !userLogin ||
      !currentInstallationId
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
        userLogin,
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
          userId: userId,
          userName: userLogin,
          installationId: currentInstallationId,
          scheduleTimeUTC: updatedSettings.scheduleTimeUTC,
          includeWeekends: updatedSettings.scheduleIncludeWeekends,
          scheduleExecutionCount: updatedSettings.scheduleExecutionCount,
          scheduleIntervalMinutes: updatedSettings.scheduleIntervalMinutes,
        });
      } else {
        await deleteSchedules(currentOwnerId, currentRepoId);
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
      scheduleExecutionCount: "Executions per day",
      scheduleIntervalMinutes: "Interval",
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

    // When enabling triggerOnSchedule, calculate UTC if it's not calculated yet
    if (key === "triggerOnSchedule" && newValue) {
      if (!updatedSettings.scheduleTimeLocal) updatedSettings.scheduleTimeLocal = "09:00";

      if (!updatedSettings.scheduleTimeUTC)
        updatedSettings.scheduleTimeUTC = convertLocalToUTC(updatedSettings.scheduleTimeLocal);
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
    field:
      | "scheduleTimeLocal"
      | "scheduleIncludeWeekends"
      | "scheduleExecutionCount"
      | "scheduleIntervalMinutes",
    value: string | boolean | number
  ) => {
    let updatedSettings = {
      ...triggerSettings,
      [field]: value,
    };

    if (field === "scheduleTimeLocal" && typeof value === "string") {
      updatedSettings.scheduleTimeUTC = convertLocalToUTC(value);
    }

    setTriggerSettings(updatedSettings);

    // For checkbox changes and execution count changes, save immediately
    if (field === "scheduleIncludeWeekends" || field === "scheduleExecutionCount") {
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

  const calculateExecutionTimes = () => {
    if (!triggerSettings.scheduleExecutionCount) return [];

    const intervalMinutes = triggerSettings.scheduleIntervalMinutes;
    const executionTimes = [];
    const [startHour, startMinute] = triggerSettings.scheduleTimeLocal.split(":").map(Number);

    for (let i = 0; i < triggerSettings.scheduleExecutionCount; i++) {
      const totalMinutes = startMinute + i * intervalMinutes;
      const hour = startHour + Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;

      if (hour < 24) {
        const timeStr = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        executionTimes.push(timeStr);
      }
    }

    return executionTimes;
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
              description={
                <>
                  Triggers GitAuto to respond to review comments on GitAuto-created PRs by
                  automatically creating fix commits. Not triggered by comments on PRs created by
                  others.{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}
                    className="text-pink-600 hover:text-pink-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more →
                  </Link>
                </>
              }
              isEnabled={triggerSettings.triggerOnReviewComment}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnReviewComment")}
            />

            <TriggerToggle
              title="On test failure"
              description={
                <>
                  Triggers GitAuto to automatically create a fix commit when a CI test fails on a
                  GitAuto-created PR. Not triggered by test failures on PRs created by others.{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}
                    className="text-pink-600 hover:text-pink-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more →
                  </Link>
                </>
              }
              isEnabled={triggerSettings.triggerOnTestFailure}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnTestFailure")}
            />

            <TriggerToggle
              title="On PR change"
              description={
                <>
                  Triggers {PRODUCT_NAME} to add unit tests when pull requests are opened, updated,
                  or synchronized in this repository. Cannot be used together with &quot;On
                  merge&quot; trigger.{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.PR_CHANGE}
                    className="text-pink-600 hover:text-pink-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more →
                  </Link>
                </>
              }
              isEnabled={triggerSettings.triggerOnPrChange}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnPrChange")}
            />

            <TriggerToggle
              title="On merge"
              description={
                <>
                  Triggers {PRODUCT_NAME} to add unit tests for code that has been merged into your
                  target branch. Ensures newly merged features have proper test coverage. Cannot be
                  used together with &quot;On PR change&quot; trigger.{" "}
                  <Link
                    href={RELATIVE_URLS.DOCS.TRIGGERS.PR_MERGE}
                    className="text-pink-600 hover:text-pink-700 underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more →
                  </Link>
                </>
              }
              isEnabled={triggerSettings.triggerOnMerged}
              isDisabled={isSaving}
              onToggle={() => handleToggle("triggerOnMerged")}
            />

            <div>
              <TriggerToggle
                title="On schedule"
                description={
                  <>
                    Triggers GitAuto to automatically create a PR to add unit tests at specified
                    times, prioritizing files with the lowest test coverage first.{" "}
                    <Link
                      href={RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}
                      className="text-pink-600 hover:text-pink-700 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Learn more →
                    </Link>
                  </>
                }
                isEnabled={triggerSettings.triggerOnSchedule}
                isDisabled={isSaving}
                onToggle={() => handleToggle("triggerOnSchedule")}
              />
            </div>
          </div>

          <div className={`h-72 ${triggerSettings.triggerOnSchedule ? "block" : "invisible"}`}>
            {triggerSettings.triggerOnSchedule && (
              <div className="ml-10 mt-3 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label
                      htmlFor="scheduleTimeLocal"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start time
                    </label>
                    <input
                      type="time"
                      id="scheduleTimeLocal"
                      value={triggerSettings.scheduleTimeLocal}
                      onChange={(e) => handleScheduleChange("scheduleTimeLocal", e.target.value)}
                      onFocus={handleTimeFocus}
                      onBlur={handleTimeBlur}
                      className="w-full h-12 p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      disabled={isSaving}
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Time is based on {getTimezoneInfo()}
                    </p>
                  </div>

                  <div>
                    <label
                      htmlFor="scheduleExecutions"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Executions per day
                    </label>
                    <select
                      id="scheduleExecutions"
                      value={triggerSettings.scheduleExecutionCount || 1}
                      onChange={(e) =>
                        handleScheduleChange("scheduleExecutionCount", parseInt(e.target.value))
                      }
                      className="w-full h-12 p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                      disabled={isSaving}
                    >
                      {Array.from({ length: MAX_EXECUTIONS }, (_, i) => i + 1).map((count) => (
                        <option key={count} value={count}>
                          {count} time{count > 1 ? "s" : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Show interval settings only if execution count > 1 */}
                  {(triggerSettings.scheduleExecutionCount || 1) > 1 && (
                    <div>
                      <label
                        htmlFor="scheduleInterval"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Interval
                      </label>
                      <select
                        id="scheduleInterval"
                        value={triggerSettings.scheduleIntervalMinutes || 15}
                        onChange={(e) =>
                          handleScheduleChange("scheduleIntervalMinutes", parseInt(e.target.value))
                        }
                        className="w-full h-12 p-2 border border-gray-300 rounded-md focus:ring-pink-500 focus:border-pink-500"
                        disabled={isSaving}
                      >
                        {ALLOWED_INTERVALS.map((interval) => (
                          <option key={interval} value={interval}>
                            Every {interval} minutes
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Preview execution times - show only if execution count > 1 */}
                {(triggerSettings.scheduleExecutionCount || 1) > 1 &&
                  calculateExecutionTimes().length > 0 && (
                    <div className="bg-blue-50 p-3 rounded border border-blue-200 mb-4">
                      <p className="text-sm font-medium text-blue-800 mb-2">
                        Daily execution times:
                      </p>
                      <p className="text-sm text-blue-700">
                        {calculateExecutionTimes().join(", ")}
                      </p>
                    </div>
                  )}

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

      {(isLoading || isSaving) && <LoadingSpinner />}
    </div>
  );
}
