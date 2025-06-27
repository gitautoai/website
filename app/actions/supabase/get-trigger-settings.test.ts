import { getTriggerSettings } from "./get-trigger-settings";
import { supabase } from "@/lib/supabase";
import type { TriggerSettings } from "@/app/settings/types";
import { MOCK_OWNER, MOCK_REPO, MOCK_TRIGGER_SETTINGS, MOCK_DATABASE_ERROR } from "@/__tests__/constants";

// Mock the supabase module
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("getTriggerSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSelect = jest.fn();
  const mockEq = jest.fn();
  const mockMaybeSingle = jest.fn();

  beforeEach(() => {
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
    } as any);
    mockSelect.mockReturnValue({
      eq: mockEq,
    } as any);
    mockEq.mockReturnValue({
      eq: mockEq,
    } as any);
    mockEq.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);
  });

  it("should throw error when ownerId is missing", async () => {
    await expect(getTriggerSettings(0, MOCK_REPO.id)).rejects.toThrow("Missing required parameters");
  });

  it("should throw error when repoId is missing", async () => {
    await expect(getTriggerSettings(MOCK_OWNER.id, 0)).rejects.toThrow("Missing required parameters");
  });

  it("should throw error when both parameters are missing", async () => {
    await expect(getTriggerSettings(0, 0)).rejects.toThrow("Missing required parameters");
  });

  it("should return default settings when no data is found", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    const result = await getTriggerSettings(123, 456);

    expect(result).toEqual({
      triggerOnReviewComment: true,
      triggerOnTestFailure: true,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: false,
      scheduleTime: "09:00",
      scheduleIncludeWeekends: false,
    });
  });

  it("should throw error when supabase returns an error", async () => {
    const mockError = new Error("Database error");
    mockMaybeSingle.mockResolvedValue({ data: {}, error: mockError });

    await expect(getTriggerSettings(123, 456)).rejects.toThrow("Database error");
  });

  it("should return settings with converted schedule time from UTC to local", async () => {
    const mockData = {
      trigger_on_review_comment: true,
      trigger_on_test_failure: false,
      trigger_on_commit: true,
      trigger_on_pr_change: false,
      trigger_on_merged: true,
      trigger_on_schedule: true,
      schedule_frequency: "daily",
      schedule_time: "14:30:00+00", // 2:30 PM UTC
      schedule_include_weekends: true,
    };

    mockMaybeSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await getTriggerSettings(123, 456);

    expect(result.triggerOnReviewComment).toBe(true);
    expect(result.triggerOnTestFailure).toBe(false);
    expect(result.triggerOnCommit).toBe(true);
    expect(result.triggerOnPrChange).toBe(false);
    expect(result.triggerOnMerged).toBe(true);
    expect(result.triggerOnSchedule).toBe(true);
    expect(result.scheduleIncludeWeekends).toBe(true);
    // Schedule time should be converted from UTC to local time
    expect(result.scheduleTime).toMatch(/^\d{2}:\d{2}$/);
  });

  it("should handle null/undefined values in database response", async () => {
    const mockData = {
      trigger_on_review_comment: null,
      trigger_on_test_failure: undefined,
      trigger_on_commit: null,
      trigger_on_pr_change: null,
      trigger_on_merged: null,
      trigger_on_schedule: null,
      schedule_frequency: null,
      schedule_time: null,
      schedule_include_weekends: null,
    };

    mockMaybeSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await getTriggerSettings(123, 456);

    expect(result).toEqual({
      triggerOnReviewComment: false,
      triggerOnTestFailure: false,
      triggerOnCommit: false,
      triggerOnPrChange: false,
      triggerOnMerged: false,
      triggerOnSchedule: false,
      scheduleTime: "09:00", // Default when schedule_time is null
      scheduleIncludeWeekends: false,
    });
  });

  it("should use default schedule time when schedule_time conversion fails", async () => {
    const mockData = {
      trigger_on_review_comment: true,
      trigger_on_test_failure: true,
      trigger_on_commit: false,
      trigger_on_pr_change: false,
      trigger_on_merged: false,
      trigger_on_schedule: true,
      schedule_frequency: "daily",
      schedule_time: "invalid-time-format",
      schedule_include_weekends: false,
    };

    mockMaybeSingle.mockResolvedValue({ data: mockData, error: null });

    // Mock console.error to avoid noise in test output
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();

    const result = await getTriggerSettings(123, 456);

    expect(result.scheduleTime).toBe("09:00");
    expect(consoleSpy).toHaveBeenCalledWith(
      "Failed to convert schedule time from UTC to local:",
      expect.any(Error)
    );

    consoleSpy.mockRestore();
  });

  it("should call supabase with correct parameters", async () => {
    mockMaybeSingle.mockResolvedValue({ data: null, error: null });

    await getTriggerSettings(123, 456);

    expect(mockSupabase.from).toHaveBeenCalledWith("repositories");
    expect(mockSelect).toHaveBeenCalledWith(
      expect.stringContaining("trigger_on_review_comment")
    );
    expect(mockEq).toHaveBeenCalledWith("owner_id", 123);
    expect(mockEq).toHaveBeenCalledWith("repo_id", 456);
    expect(mockMaybeSingle).toHaveBeenCalled();
  });

  it("should handle edge case with zero values that are falsy but valid", async () => {
    const mockData = {
      trigger_on_review_comment: false,
      trigger_on_test_failure: false,
      trigger_on_commit: false,
      trigger_on_pr_change: false,
      trigger_on_merged: false,
      trigger_on_schedule: false,
      schedule_frequency: "",
      schedule_time: "00:00:00+00", // Midnight UTC
      schedule_include_weekends: false,
    };

    mockMaybeSingle.mockResolvedValue({ data: mockData, error: null });

    const result = await getTriggerSettings(123, 456);

    expect(result.triggerOnReviewComment).toBe(false);
    expect(result.triggerOnTestFailure).toBe(false);
    expect(result.triggerOnCommit).toBe(false);
    expect(result.triggerOnPrChange).toBe(false);
    expect(result.triggerOnMerged).toBe(false);
    expect(result.triggerOnSchedule).toBe(false);
    expect(result.scheduleIncludeWeekends).toBe(false);
    // Should convert midnight UTC to local time
    expect(result.scheduleTime).toMatch(/^\d{2}:\d{2}$/);
  });
});
