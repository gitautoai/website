"use client";

// Third-party imports
import Link from "next/link";
import { useEffect, useState } from "react";

// Local imports (Actions)
import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { disableSchedules } from "@/app/actions/aws/disable-schedules";
import { hasPurchasedCredits } from "@/app/actions/supabase/credits/has-purchased-credits";
import { addSchedulePause } from "@/app/actions/supabase/schedule-pauses/add-schedule-pause";
import { deleteSchedulePause } from "@/app/actions/supabase/schedule-pauses/delete-schedule-pause";
import { getAllSchedulePauses } from "@/app/actions/supabase/schedule-pauses/get-all-schedule-pauses";
import type { SchedulePause } from "@/app/actions/supabase/schedule-pauses/get-all-schedule-pauses";
import { getAllTriggerSettings } from "@/app/actions/supabase/repositories/get-all-trigger-settings";
import type { TriggerSettingsForRepo } from "@/app/actions/supabase/repositories/get-all-trigger-settings";
import { upsertRepository } from "@/app/actions/supabase/repositories/upsert-repository";
import { setupCoverageWorkflow } from "@/app/actions/setup-coverage-workflow";
import { scheduleExists } from "@/app/actions/aws/schedule-exists";
import { slackUs } from "@/app/actions/slack/slack-us";

// Local imports (Components)
import { useAccountContext } from "@/app/components/contexts/Account";
import LoadingSpinner from "@/app/components/LoadingSpinner";
import Modal from "@/app/components/Modal";
import RepositorySelector from "@/app/settings/components/RepositorySelector";
import PauseModal from "@/app/settings/triggers/PauseModal";
import ToggleSwitch from "@/app/settings/triggers/ToggleSwitch";
import type { TriggerSettings } from "@/app/settings/types";

// Local imports (Others)
import { RELATIVE_URLS } from "@/config/urls";
import {
  ALLOWED_INTERVALS,
  DEFAULT_SCHEDULE_CONFIG,
  MAX_EXECUTIONS,
  MAX_SCHEDULE_REPOS_FREE,
} from "@/config/schedule";
import { convertLocalToUTC } from "@/utils/convert-local-to-utc";
import { convertUTCToLocal } from "@/utils/convert-utc-to-local";
import { formatDateTime } from "@/utils/format-date-time";

type RepoWithSettings = {
  repoId: number;
  repoName: string;
  settings: TriggerSettingsForRepo | null;
};

export default function TriggersPage() {
  const {
    currentOwnerId,
    currentOwnerType,
    currentOwnerName,
    organizations,
    userId,
    userLogin,
    userName,
    currentInstallationId,
  } = useAccountContext();

  const [isLoading, setIsLoading] = useState(true);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [repoSettings, setRepoSettings] = useState<RepoWithSettings[]>([]);
  const [scheduleConfigs, setScheduleConfigs] = useState<
    Record<number, { time: string; executions: number; interval: number; weekends: boolean }>
  >({});
  const [schedulePauses, setSchedulePauses] = useState<Record<number, SchedulePause[]>>({});
  const [newPauseForm, setNewPauseForm] = useState<
    Record<number, { start: string; end: string; reason: string; isOpen: boolean }>
  >({});
  const [pauseErrors, setPauseErrors] = useState<Record<number, string>>({});
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [pauseAllForm, setPauseAllForm] = useState<{
    start: string;
    end: string;
    reason: string;
    isOpen: boolean;
    error: string;
  }>({ start: "", end: "", reason: "", isOpen: false, error: "" });

  useEffect(() => {
    const loadAllSettings = async () => {
      if (!currentOwnerId || !currentOwnerName) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        const currentOrg = organizations.find((org) => org.ownerName === currentOwnerName);
        if (!currentOrg) {
          setIsLoading(false);
          return;
        }

        const allSettings = await getAllTriggerSettings(currentOwnerId);
        const settingsMap = new Map(allSettings.map((s) => [s.repo_id, s]));
        const reposToShow = currentOrg.repositories;

        const combined: RepoWithSettings[] = reposToShow.map((repo) => ({
          repoId: repo.repoId,
          repoName: repo.repoName,
          settings: settingsMap.has(repo.repoId) ? settingsMap.get(repo.repoId)! : null,
        }));

        setRepoSettings(combined);

        // Initialize schedule configs from loaded settings
        const configs: Record<
          number,
          { time: string; executions: number; interval: number; weekends: boolean }
        > = {};
        combined.forEach((repo) => {
          if (repo.settings?.schedule_time) {
            const timeParts = repo.settings.schedule_time.split(":");
            const utcHours = parseInt(timeParts[0], 10);
            const utcMinutes = parseInt(timeParts[1], 10);
            const scheduleTimeUTC = `${utcHours.toString().padStart(2, "0")}:${utcMinutes.toString().padStart(2, "0")}`;
            const scheduleTimeLocal = convertUTCToLocal(scheduleTimeUTC);
            configs[repo.repoId] = {
              time: scheduleTimeLocal,
              executions: repo.settings.schedule_execution_count,
              interval: repo.settings.schedule_interval_minutes,
              weekends: repo.settings.schedule_include_weekends,
            };
          } else {
            configs[repo.repoId] = DEFAULT_SCHEDULE_CONFIG;
          }
        });
        setScheduleConfigs(configs);

        // Load schedule pauses and check paid status
        const [allPauses, purchased] = await Promise.all([
          getAllSchedulePauses(currentOwnerId),
          hasPurchasedCredits(currentOwnerId),
        ]);
        const pausesByRepo: Record<number, SchedulePause[]> = {};
        for (const pause of allPauses) {
          if (!pausesByRepo[pause.repo_id]) pausesByRepo[pause.repo_id] = [];
          pausesByRepo[pause.repo_id].push(pause);
        }
        setSchedulePauses(pausesByRepo);
        setIsPaidUser(purchased);
      } catch (error) {
        console.error("Failed to load trigger settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllSettings();
  }, [currentOwnerId, currentOwnerName, organizations]);

  const updateSetting = async (
    repoId: number,
    repoName: string,
    field: keyof Pick<
      TriggerSettings,
      "triggerOnReviewComment" | "triggerOnTestFailure" | "triggerOnSchedule"
    >,
    value: boolean,
  ) => {
    if (
      !currentOwnerId ||
      !currentOwnerType ||
      !currentOwnerName ||
      !userId ||
      !userLogin ||
      !currentInstallationId
    )
      return;

    // Block free users from enabling schedule on more repos than allowed
    if (field === "triggerOnSchedule" && value && !isPaidUser) {
      const enabledCount = repoSettings.filter(
        (r) => r.settings?.trigger_on_schedule && r.repoId !== repoId,
      ).length;
      if (enabledCount >= MAX_SCHEDULE_REPOS_FREE) return;
    }

    const repoData = repoSettings.find((r) => r.repoId === repoId);
    const currentDbSettings = repoData?.settings;
    const scheduleConfig = scheduleConfigs[repoId] || DEFAULT_SCHEDULE_CONFIG;

    const scheduleTimeUTC = convertLocalToUTC(scheduleConfig.time);

    const currentSettings: TriggerSettings = {
      triggerOnReviewComment: currentDbSettings?.trigger_on_review_comment ?? true,
      triggerOnTestFailure: currentDbSettings?.trigger_on_test_failure ?? true,
      triggerOnSchedule: currentDbSettings?.trigger_on_schedule ?? false,
      scheduleTimeLocal: scheduleConfig.time,
      scheduleTimeUTC,
      scheduleIncludeWeekends: scheduleConfig.weekends,
      scheduleExecutionCount: scheduleConfig.executions,
      scheduleIntervalMinutes: scheduleConfig.interval,
    };

    const updatedSettings = {
      ...currentSettings,
      [field]: value,
    };

    const updatedDbSettings: TriggerSettingsForRepo = {
      repo_id: repoId,
      trigger_on_review_comment: updatedSettings.triggerOnReviewComment,
      trigger_on_test_failure: updatedSettings.triggerOnTestFailure,
      trigger_on_schedule: updatedSettings.triggerOnSchedule,
      schedule_time: updatedSettings.triggerOnSchedule
        ? `${updatedSettings.scheduleTimeUTC}:00+00`
        : null,
      schedule_include_weekends: updatedSettings.scheduleIncludeWeekends,
      schedule_execution_count: updatedSettings.scheduleExecutionCount,
      schedule_interval_minutes: updatedSettings.scheduleIntervalMinutes,
      updated_by: `${userId}:${userLogin}`,
      updated_at: new Date().toISOString(),
    };

    setRepoSettings((prev) =>
      prev.map((r) => (r.repoId === repoId ? { ...r, settings: updatedDbSettings } : r)),
    );

    // Save to database
    upsertRepository(currentOwnerId, repoId, repoName, userId, userLogin, {
      trigger_on_review_comment: updatedSettings.triggerOnReviewComment,
      trigger_on_test_failure: updatedSettings.triggerOnTestFailure,
      trigger_on_schedule: updatedSettings.triggerOnSchedule,
      schedule_time: updatedSettings.triggerOnSchedule
        ? `${updatedSettings.scheduleTimeUTC}:00+00`
        : null,
      schedule_frequency: updatedSettings.triggerOnSchedule ? "daily" : null,
      schedule_include_weekends: updatedSettings.scheduleIncludeWeekends,
      schedule_execution_count: updatedSettings.scheduleExecutionCount,
      schedule_interval_minutes: updatedSettings.scheduleIntervalMinutes,
    })
      .then(async () => {
        // Handle AWS scheduling and coverage workflow setup
        if (updatedSettings.triggerOnSchedule) {
          // Check if schedule already exists — if not, this is the first time
          const hasExistingSchedule = await scheduleExists(currentOwnerId, repoId);
          const promises: Promise<unknown>[] = [
            createOrUpdateSchedule({
              ownerId: currentOwnerId,
              ownerType: currentOwnerType,
              ownerName: currentOwnerName,
              repoId: repoId,
              repoName: repoName,
              userId: userId,
              userName: userLogin,
              installationId: currentInstallationId,
              scheduleTimeUTC: updatedSettings.scheduleTimeUTC,
              includeWeekends: updatedSettings.scheduleIncludeWeekends,
              scheduleExecutionCount: updatedSettings.scheduleExecutionCount,
              scheduleIntervalMinutes: updatedSettings.scheduleIntervalMinutes,
            }),
          ];
          await Promise.all(promises);
          // Fire and forget — Lambda runs setup in the background
          if (!hasExistingSchedule) {
            setupCoverageWorkflow(currentOwnerName, repoName, currentInstallationId, userLogin).catch(
              () => {},
            );
            setShowSetupModal(true);
          }
        } else {
          await disableSchedules(currentOwnerId, repoId);
        }
      })
      .catch((error) => {
        console.error("Error saving trigger settings:", error);
        setRepoSettings((prev) =>
          prev.map((r) =>
            r.repoId === repoId ? { ...r, settings: currentDbSettings || null } : r,
          ),
        );
      });

    // Notify via Slack
    const settingLabels: Record<string, string> = {
      triggerOnReviewComment: "Review Comment trigger",
      triggerOnTestFailure: "Test Failure trigger",
      triggerOnSchedule: "Schedule trigger",
    };
    const message = `${userName} (${userId}) updated ${settingLabels[field]} to ${value} for ${currentOwnerName}/${repoName}`;
    slackUs(message).catch((error) => console.error("Error sending Slack notification:", error));
  };

  const updateScheduleConfig = async (
    repoId: number,
    repoName: string,
    field: "time" | "executions" | "interval" | "weekends",
    value: string | number | boolean,
  ) => {
    if (
      !currentOwnerId ||
      !currentOwnerType ||
      !currentOwnerName ||
      !userId ||
      !userLogin ||
      !currentInstallationId
    )
      return;

    const repoData = repoSettings.find((r) => r.repoId === repoId);
    const currentDbSettings = repoData?.settings;
    const currentConfig = scheduleConfigs[repoId] || DEFAULT_SCHEDULE_CONFIG;

    const updatedConfig = {
      ...currentConfig,
      [field]: value,
    };

    setScheduleConfigs((prev) => ({
      ...prev,
      [repoId]: updatedConfig,
    }));

    const scheduleTimeUTC = convertLocalToUTC(updatedConfig.time);

    const updatedSettings: TriggerSettings = {
      triggerOnReviewComment: currentDbSettings?.trigger_on_review_comment ?? true,
      triggerOnTestFailure: currentDbSettings?.trigger_on_test_failure ?? true,
      triggerOnSchedule: currentDbSettings?.trigger_on_schedule ?? false,
      scheduleTimeLocal: updatedConfig.time,
      scheduleTimeUTC,
      scheduleIncludeWeekends: updatedConfig.weekends,
      scheduleExecutionCount: updatedConfig.executions,
      scheduleIntervalMinutes: updatedConfig.interval,
    };

    // Save to database and AWS
    upsertRepository(currentOwnerId, repoId, repoName, userId, userLogin, {
      trigger_on_review_comment: updatedSettings.triggerOnReviewComment,
      trigger_on_test_failure: updatedSettings.triggerOnTestFailure,
      trigger_on_schedule: updatedSettings.triggerOnSchedule,
      schedule_time: updatedSettings.triggerOnSchedule
        ? `${updatedSettings.scheduleTimeUTC}:00+00`
        : null,
      schedule_frequency: updatedSettings.triggerOnSchedule ? "daily" : null,
      schedule_include_weekends: updatedSettings.scheduleIncludeWeekends,
      schedule_execution_count: updatedSettings.scheduleExecutionCount,
      schedule_interval_minutes: updatedSettings.scheduleIntervalMinutes,
    })
      .then(async () => {
        if (updatedSettings.triggerOnSchedule) {
          await createOrUpdateSchedule({
            ownerId: currentOwnerId,
            ownerType: currentOwnerType,
            ownerName: currentOwnerName,
            repoId: repoId,
            repoName: repoName,
            userId: userId,
            userName: userLogin,
            installationId: currentInstallationId,
            scheduleTimeUTC: updatedSettings.scheduleTimeUTC,
            includeWeekends: updatedSettings.scheduleIncludeWeekends,
            scheduleExecutionCount: updatedSettings.scheduleExecutionCount,
            scheduleIntervalMinutes: updatedSettings.scheduleIntervalMinutes,
          });
        }
      })
      .catch((error) => console.error("Error saving schedule settings:", error));

    // Notify via Slack
    const fieldLabels: Record<string, string> = {
      time: "Schedule time",
      executions: "Executions per day",
      interval: "Interval",
      weekends: "Include weekends",
    };
    const message = `${userName} (${userId}) updated ${fieldLabels[field]} to ${value} for ${currentOwnerName}/${repoName}`;
    slackUs(message).catch((error) => console.error("Error sending Slack notification:", error));
  };

  const handleAddPause = async (repoId: number, repoName: string) => {
    if (!currentOwnerId || !userId || !userLogin || !currentOwnerName) return;
    const form = newPauseForm[repoId];
    if (!form?.start || !form?.end) return;

    try {
      const pause = await addSchedulePause(
        currentOwnerId,
        repoId,
        new Date(`${form.start}T00:00:00`).toISOString(),
        new Date(`${form.end}T23:59:59`).toISOString(),
        `${userId}:${userLogin}`,
        form.reason || undefined,
      );

      setSchedulePauses((prev) => ({
        ...prev,
        [repoId]: [...(prev[repoId] || []), pause].sort((a, b) =>
          a.pause_start.localeCompare(b.pause_start),
        ),
      }));

      setNewPauseForm((prev) => ({
        ...prev,
        [repoId]: { start: "", end: "", reason: "", isOpen: false },
      }));

      setPauseErrors((prev) => ({ ...prev, [repoId]: "" }));

      const message = `${userName} (${userId}) added schedule pause ${form.start} to ${form.end} for ${currentOwnerName}/${repoName}`;
      slackUs(message).catch(console.error);
    } catch (error) {
      setPauseErrors((prev) => ({
        ...prev,
        [repoId]: error instanceof Error ? error.message : "Failed to add pause",
      }));
    }
  };

  const handleDeletePause = async (repoId: number, pauseId: string, repoName: string) => {
    if (!currentOwnerName) return;
    try {
      await deleteSchedulePause(pauseId);

      setSchedulePauses((prev) => ({
        ...prev,
        [repoId]: (prev[repoId] || []).filter((p) => p.id !== pauseId),
      }));

      const message = `${userName} (${userId}) removed a schedule pause for ${currentOwnerName}/${repoName}`;
      slackUs(message).catch(console.error);
    } catch (error) {
      console.error("Failed to delete pause:", error);
    }
  };

  const handlePauseAll = async () => {
    if (!currentOwnerId || !userId || !userLogin || !currentOwnerName) return;
    if (!pauseAllForm.start || !pauseAllForm.end) return;

    const scheduledRepos = repoSettings.filter((r) => r.settings?.trigger_on_schedule);
    if (scheduledRepos.length === 0) return;

    try {
      const results = await Promise.all(
        scheduledRepos.map((repo) =>
          addSchedulePause(
            currentOwnerId,
            repo.repoId,
            new Date(`${pauseAllForm.start}T00:00:00`).toISOString(),
            new Date(`${pauseAllForm.end}T23:59:59`).toISOString(),
            `${userId}:${userLogin}`,
            pauseAllForm.reason || undefined,
          ),
        ),
      );

      const newPauses: Record<number, SchedulePause[]> = { ...schedulePauses };
      results.forEach((pause) => {
        if (!newPauses[pause.repo_id]) newPauses[pause.repo_id] = [];
        newPauses[pause.repo_id] = [...newPauses[pause.repo_id], pause].sort((a, b) =>
          a.pause_start.localeCompare(b.pause_start),
        );
      });
      setSchedulePauses(newPauses);

      setPauseAllForm({ start: "", end: "", reason: "", isOpen: false, error: "" });

      const message = `${userName} (${userId}) added schedule pause ${pauseAllForm.start} to ${pauseAllForm.end} for all ${scheduledRepos.length} repos in ${currentOwnerName}`;
      slackUs(message).catch(console.error);
    } catch (error) {
      setPauseAllForm((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "Failed to add pauses",
      }));
    }
  };

  const toLocalDate = (utcTimestamp: string) => {
    const d = new Date(utcTimestamp);
    return `${d.getFullYear()}-${(d.getMonth() + 1).toString().padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
  };

  const getTimezoneInfo = () => {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const now = new Date();
      const offset = -now.getTimezoneOffset() / 60;
      const offsetStr = offset >= 0 ? `UTC+${offset}` : `UTC${offset}`;
      return `${timezone} (${offsetStr})`;
    } catch {
      return "your local timezone";
    }
  };

  const ColumnHeader = ({
    title,
    description,
    learnMoreUrl,
  }: {
    title: string;
    description: string;
    learnMoreUrl?: string;
  }) => (
    <div className="flex items-center gap-2">
      <span>{title}</span>
      <div className="group relative">
        <svg className="w-4 h-4 text-gray-400 cursor-help" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
        <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-sm text-white bg-gray-900 rounded-md shadow-lg -left-24">
          {description}
          {learnMoreUrl && (
            <>
              {" "}
              <Link
                href={learnMoreUrl}
                className="text-pink-300 hover:text-pink-200 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Learn more →
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-left">Trigger settings</h1>

      <div className="mb-6">
        <RepositorySelector ownerOnly={true} />
      </div>

      <p className="mb-6 text-gray-600">
        These settings control when GitAuto will automatically analyze your code and generate tests.
        Each trigger can be enabled independently. Changes are saved automatically.
      </p>

      {repoSettings.some((r) => r.settings?.trigger_on_schedule) && (
        <div className="mb-4 flex justify-end">
          <button
            onClick={() =>
              setPauseAllForm((prev) => ({
                ...prev,
                start: new Date().toISOString().split("T")[0],
                isOpen: true,
              }))
            }
            className="px-3 py-1.5 text-sm text-pink-600 border border-pink-600 rounded-md hover:bg-pink-50"
          >
            Pause All Scheduled Repos
          </button>
        </div>
      )}

      {/* Pause All Modal */}
      {pauseAllForm.isOpen && (
        <PauseModal
          title="Pause All Scheduled Repos"
          description={`This will add a pause period to all ${repoSettings.filter((r) => r.settings?.trigger_on_schedule).length} repos with schedule triggers enabled.`}
          start={pauseAllForm.start}
          end={pauseAllForm.end}
          reason={pauseAllForm.reason}
          error={pauseAllForm.error}
          onStartChange={(v) => setPauseAllForm((prev) => ({ ...prev, start: v }))}
          onEndChange={(v) => setPauseAllForm((prev) => ({ ...prev, end: v }))}
          onReasonChange={(v) => setPauseAllForm((prev) => ({ ...prev, reason: v }))}
          onSubmit={handlePauseAll}
          onClose={() =>
            setPauseAllForm({ start: "", end: "", reason: "", isOpen: false, error: "" })
          }
          submitLabel="Pause All"
        />
      )}

      <div className="relative rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 z-10">
                  Repository
                </th>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 w-32 z-10">
                  <ColumnHeader
                    title="Review Comment Trigger"
                    description="Responds to review comments on GitAuto-created PRs by automatically creating fix commits."
                    learnMoreUrl={RELATIVE_URLS.DOCS.TRIGGERS.REVIEW_COMMENT}
                  />
                </th>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 w-28 z-10">
                  <ColumnHeader
                    title="Test Failure Trigger"
                    description="Automatically creates a fix commit when a CI test fails on a GitAuto-created PR."
                    learnMoreUrl={RELATIVE_URLS.DOCS.TRIGGERS.TEST_FAILURE}
                  />
                </th>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 w-24 z-10">
                  <ColumnHeader
                    title="Schedule Trigger"
                    description="Automatically creates a PR to add unit tests at specified times, prioritizing files with the lowest test coverage first."
                    learnMoreUrl={RELATIVE_URLS.DOCS.TRIGGERS.SCHEDULE}
                  />
                </th>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 z-10">
                  Schedule Settings
                </th>
                <th className="sticky top-0 px-4 py-3 text-left text-sm font-medium text-gray-700 bg-gray-50 border-b border-gray-200 z-10">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {repoSettings.map((repo) => {
                const settings = repo.settings || {
                  trigger_on_review_comment: true,
                  trigger_on_test_failure: true,
                  trigger_on_schedule: false,
                  updated_at: "",
                  updated_by: "",
                };
                const scheduleConfig = scheduleConfigs[repo.repoId] || DEFAULT_SCHEDULE_CONFIG;
                const scheduleLimitReached =
                  !isPaidUser &&
                  !settings.trigger_on_schedule &&
                  repoSettings.filter((r) => r.settings?.trigger_on_schedule).length >=
                    MAX_SCHEDULE_REPOS_FREE;

                return (
                  <tr key={repo.repoId}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{repo.repoName}</td>
                    <td className="px-4 py-3">
                      <ToggleSwitch
                        checked={settings.trigger_on_review_comment}
                        onChange={() =>
                          updateSetting(
                            repo.repoId,
                            repo.repoName,
                            "triggerOnReviewComment",
                            !settings.trigger_on_review_comment,
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <ToggleSwitch
                        checked={settings.trigger_on_test_failure}
                        onChange={() =>
                          updateSetting(
                            repo.repoId,
                            repo.repoName,
                            "triggerOnTestFailure",
                            !settings.trigger_on_test_failure,
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <ToggleSwitch
                          checked={settings.trigger_on_schedule}
                          disabled={scheduleLimitReached}
                          onChange={() =>
                            updateSetting(
                              repo.repoId,
                              repo.repoName,
                              "triggerOnSchedule",
                              !settings.trigger_on_schedule,
                            )
                          }
                          title={
                            scheduleLimitReached
                              ? `Free plan: max ${MAX_SCHEDULE_REPOS_FREE} repo. Purchase credits to unlock unlimited.`
                              : undefined
                          }
                        />
                        {scheduleLimitReached && (
                          <Link
                            href={RELATIVE_URLS.PRICING}
                            className="text-xs text-pink-600 hover:text-pink-700 hover:underline"
                          >
                            Purchase credits
                          </Link>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1.5 py-1">
                        <div className="flex items-center gap-2 h-6">
                          <span className="text-xs text-gray-700 w-16 font-medium">Start</span>
                          <input
                            type="time"
                            value={scheduleConfig.time}
                            onChange={(e) => {
                              if (!e.target.value) return;
                              updateScheduleConfig(
                                repo.repoId,
                                repo.repoName,
                                "time",
                                e.target.value,
                              );
                            }}
                            disabled={!settings.trigger_on_schedule}
                            className="w-28 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-400"
                            title={`Timezone: ${getTimezoneInfo()}`}
                          />
                        </div>
                        <div className="flex items-center gap-2 h-6">
                          <span className="text-xs text-gray-700 w-16 font-medium">Times/Day</span>
                          <select
                            value={scheduleConfig.executions}
                            onChange={(e) =>
                              updateScheduleConfig(
                                repo.repoId,
                                repo.repoName,
                                "executions",
                                parseInt(e.target.value),
                              )
                            }
                            disabled={!settings.trigger_on_schedule}
                            className="w-28 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            {Array.from({ length: MAX_EXECUTIONS }, (_, i) => i + 1).map(
                              (count) => (
                                <option key={count} value={count}>
                                  {count}x
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 h-6">
                          <span className="text-xs text-gray-700 w-16 font-medium">Interval</span>
                          <select
                            value={scheduleConfig.interval}
                            onChange={(e) =>
                              updateScheduleConfig(
                                repo.repoId,
                                repo.repoName,
                                "interval",
                                parseInt(e.target.value),
                              )
                            }
                            disabled={
                              !settings.trigger_on_schedule || scheduleConfig.executions === 1
                            }
                            className="w-28 px-2 py-1 text-xs text-gray-900 border border-gray-300 rounded focus:ring-1 focus:ring-pink-500 focus:border-pink-500 disabled:bg-gray-50 disabled:text-gray-400"
                          >
                            {ALLOWED_INTERVALS.map((interval) => (
                              <option key={interval} value={interval}>
                                {interval}min
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-center gap-2 h-6">
                          <span className="text-xs text-gray-700 w-16 font-medium">Weekends</span>
                          <input
                            type="checkbox"
                            checked={scheduleConfig.weekends}
                            onChange={(e) =>
                              updateScheduleConfig(
                                repo.repoId,
                                repo.repoName,
                                "weekends",
                                e.target.checked,
                              )
                            }
                            disabled={!settings.trigger_on_schedule}
                            className="h-3.5 w-3.5 text-pink-600 rounded border-gray-300 disabled:bg-gray-50 disabled:border-gray-200"
                          />
                        </div>

                        {/* Schedule Pause Periods - compact indicator */}
                        {settings.trigger_on_schedule && (
                          <div className="mt-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-700 font-medium">Pauses</span>
                              {(schedulePauses[repo.repoId] || []).length > 0 && (
                                <span className="text-xs text-gray-500">
                                  {(schedulePauses[repo.repoId] || []).length}
                                </span>
                              )}
                              {(schedulePauses[repo.repoId] || []).some((p) => {
                                const localStart = toLocalDate(p.pause_start);
                                const localEnd = toLocalDate(p.pause_end);
                                const now = new Date();
                                const todayLocal = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
                                return localStart <= todayLocal && localEnd >= todayLocal;
                              }) && (
                                <span className="text-xs text-amber-600 font-medium">Active</span>
                              )}
                              <button
                                onClick={() =>
                                  setNewPauseForm((prev) => ({
                                    ...prev,
                                    [repo.repoId]: {
                                      start:
                                        prev[repo.repoId]?.start ||
                                        new Date().toISOString().split("T")[0],
                                      end: prev[repo.repoId]?.end || "",
                                      reason: prev[repo.repoId]?.reason || "",
                                      isOpen: true,
                                    },
                                  }))
                                }
                                className="text-xs text-pink-600 hover:text-pink-700 hover:underline ml-auto"
                              >
                                Manage
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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

      {/* Pause Periods Modal */}
      {repoSettings
        .filter((repo) => newPauseForm[repo.repoId]?.isOpen)
        .map((repo) => (
          <PauseModal
            key={`modal-${repo.repoId}`}
            title={`Pause Periods - ${repo.repoName}`}
            start={newPauseForm[repo.repoId]?.start || ""}
            end={newPauseForm[repo.repoId]?.end || ""}
            reason={newPauseForm[repo.repoId]?.reason || ""}
            error={pauseErrors[repo.repoId]}
            onStartChange={(v) =>
              setNewPauseForm((prev) => ({
                ...prev,
                [repo.repoId]: { ...prev[repo.repoId], start: v },
              }))
            }
            onEndChange={(v) =>
              setNewPauseForm((prev) => ({
                ...prev,
                [repo.repoId]: { ...prev[repo.repoId], end: v },
              }))
            }
            onReasonChange={(v) =>
              setNewPauseForm((prev) => ({
                ...prev,
                [repo.repoId]: { ...prev[repo.repoId], reason: v },
              }))
            }
            onSubmit={() => handleAddPause(repo.repoId, repo.repoName)}
            onClose={() =>
              setNewPauseForm((prev) => ({
                ...prev,
                [repo.repoId]: { start: "", end: "", reason: "", isOpen: false },
              }))
            }
            submitLabel="Add Pause"
          >
            {/* Existing pauses */}
            {(schedulePauses[repo.repoId] || []).length > 0 ? (
              <div className="space-y-2">
                {(schedulePauses[repo.repoId] || []).map((pause) => {
                  const localStart = toLocalDate(pause.pause_start);
                  const localEnd = toLocalDate(pause.pause_end);
                  const now = new Date();
                  const todayLocal = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, "0")}-${now.getDate().toString().padStart(2, "0")}`;
                  const isActive = localStart <= todayLocal && localEnd >= todayLocal;
                  return (
                    <div
                      key={pause.id}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg border ${isActive ? "border-amber-200 bg-amber-50" : "border-gray-200 bg-gray-50"}`}
                    >
                      {isActive && (
                        <span className="text-xs font-medium text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                          Active
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="text-sm text-gray-700">
                          {formatDateTime(localStart, { includeTime: false })} ~{" "}
                          {formatDateTime(localEnd, { includeTime: false })}
                        </div>
                        {pause.reason && (
                          <div className="text-xs text-gray-400">{pause.reason}</div>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeletePause(repo.repoId, pause.id, repo.repoName)}
                        className="text-red-400 hover:text-red-600 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-400">No pause periods configured.</p>
            )}
          </PauseModal>
        ))}

      {showSetupModal && (
        <Modal
          title="Setting Up CI Workflow"
          type="success"
          message="A pull request will be created shortly with a CI workflow to upload coverage reports. Check your repository for the new PR."
          onClose={() => setShowSetupModal(false)}
        />
      )}

      {isLoading && <LoadingSpinner />}
    </div>
  );
}
