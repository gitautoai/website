import { saveTriggerSettings } from "./save-trigger-settings";
import { supabase } from "@/lib/supabase";
import type { TriggerSettings } from "@/app/settings/types";

// Mock the supabase module
jest.mock("@/lib/supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

const mockSupabase = supabase as jest.Mocked<typeof supabase>;

describe("saveTriggerSettings", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockSelect = jest.fn();
  const mockMatch = jest.fn();
  const mockMaybeSingle = jest.fn();
  const mockUpdate = jest.fn();
  const mockInsert = jest.fn();
  const mockUpdateMatch = jest.fn();

  const mockSettings: TriggerSettings = {
    triggerOnReviewComment: true,
    triggerOnTestFailure: false,
    triggerOnCommit: true,
    triggerOnPrChange: false,
    triggerOnMerged: true,
    triggerOnSchedule: true,
    scheduleTime: "14:30",
    scheduleIncludeWeekends: false,
  };

  beforeEach(() => {
    mockSupabase.from.mockReturnValue({
      select: mockSelect,
      update: mockUpdate,
      insert: mockInsert,
    } as any);
    
    mockSelect.mockReturnValue({
      match: mockMatch,
    } as any);
    
    mockMatch.mockReturnValue({
      maybeSingle: mockMaybeSingle,
    } as any);
    
    // For update operations
    mockUpdateMatch.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({
      match: mockUpdateMatch,
    } as any);
    
    // For insert operations
    mockInsert.mockResolvedValue({ error: null });
  });

  describe("parameter validation", () => {
    it("should throw error when ownerId is missing", async () => {
      await expect(
        saveTriggerSettings(0, 123, "repo", 456, "user", mockSettings)
      ).rejects.toThrow("Missing required parameters: ownerId");
    });

    it("should throw error when repoId is missing", async () => {
      await expect(
        saveTriggerSettings(123, 0, "repo", 456, "user", mockSettings)
      ).rejects.toThrow("Missing required parameters: repoId");
    });

    it("should throw error when repoName is missing", async () => {
      await expect(
        saveTriggerSettings(123, 456, "", 789, "user", mockSettings)
      ).rejects.toThrow("Missing required parameters: repoName");
    });

    it("should throw error when userId is missing", async () => {
      await expect(
        saveTriggerSettings(123, 456, "repo", 0, "user", mockSettings)
      ).rejects.toThrow("Missing required parameters: userId");
    });

    it("should throw error when multiple parameters are missing", async () => {
      await expect(
        saveTriggerSettings(0, 0, "", 0, "user", mockSettings)
      ).rejects.toThrow("Missing required parameters: ownerId, repoId, repoName, userId");
    });

    it("should not throw error when userName is missing (not required)", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await expect(
        saveTriggerSettings(123, 456, "repo", 789, "", mockSettings)
      ).resolves.not.toThrow();
    });
  });

  describe("existing repository update", () => {
    it("should update existing repository when found", async () => {
      const existingRepo = { repo_id: 456 };
      mockMaybeSingle.mockResolvedValue({ data: existingRepo, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings);

      expect(mockSupabase.from).toHaveBeenCalledWith("repositories");
      expect(mockSelect).toHaveBeenCalledWith("repo_id");
      expect(mockMatch).toHaveBeenCalledWith({ owner_id: 123, repo_id: 456 });
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          updated_by: "789:testuser",
          trigger_on_review_comment: true,
          trigger_on_test_failure: false,
          trigger_on_commit: true,
          trigger_on_pr_change: false,
          trigger_on_merged: true,
          trigger_on_schedule: true,
          schedule_frequency: "daily",
          schedule_include_weekends: false,
        })
      );
    });

    it("should throw error when update fails", async () => {
      const existingRepo = { repo_id: 456 };
      const updateError = new Error("Update failed");
      mockMaybeSingle.mockResolvedValue({ data: existingRepo, error: null });
      mockUpdateMatch.mockResolvedValue({ error: updateError });

      await expect(
        saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings)
      ).rejects.toThrow("Update failed");
    });
  });

  describe("new repository creation", () => {
    it("should insert new repository when not found", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          owner_id: 123,
          repo_id: 456,
          repo_name: "test-repo",
          created_by: "789:testuser",
          updated_by: "789:testuser",
          trigger_on_review_comment: true,
          trigger_on_test_failure: false,
          trigger_on_commit: true,
          trigger_on_pr_change: false,
          trigger_on_merged: true,
          trigger_on_schedule: true,
          schedule_frequency: "daily",
          schedule_include_weekends: false,
          // Default values
          repo_rules: "",
          target_branch: "",
          use_screenshots: false,
          production_url: "",
          local_port: 8080,
          startup_commands: [],
          web_urls: [],
          file_paths: [],
        })
      );
    });

    it("should throw error when insert fails", async () => {
      const insertError = new Error("Insert failed");
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });
      mockInsert.mockResolvedValue({ error: insertError });

      await expect(
        saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings)
      ).rejects.toThrow("Insert failed");
    });
  });

  describe("schedule time conversion", () => {
    it("should convert local time to UTC when triggerOnSchedule is true", async () => {
      const settingsWithSchedule: TriggerSettings = {
        ...mockSettings,
        triggerOnSchedule: true,
        scheduleTime: "14:30", // 2:30 PM local
      };

      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", settingsWithSchedule);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.schedule_time).toMatch(/^\d{2}:\d{2}:00\+00$/);
      expect(insertCall.schedule_frequency).toBe("daily");
    });

    it("should set schedule_time to null when triggerOnSchedule is false", async () => {
      const settingsWithoutSchedule: TriggerSettings = {
        ...mockSettings,
        triggerOnSchedule: false,
        scheduleTime: "14:30",
      };

      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", settingsWithoutSchedule);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.schedule_time).toBeNull();
      expect(insertCall.schedule_frequency).toBeNull();
    });

    it("should handle edge case with midnight schedule time", async () => {
      const settingsWithMidnight: TriggerSettings = {
        ...mockSettings,
        triggerOnSchedule: true,
        scheduleTime: "00:00",
      };

      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", settingsWithMidnight);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.schedule_time).toMatch(/^\d{2}:\d{2}:00\+00$/);
    });

    it("should handle edge case with 23:59 schedule time", async () => {
      const settingsWithLateTime: TriggerSettings = {
        ...mockSettings,
        triggerOnSchedule: true,
        scheduleTime: "23:59",
      };

      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", settingsWithLateTime);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.schedule_time).toMatch(/^\d{2}:\d{2}:00\+00$/);
    });
  });

  describe("data structure validation", () => {
    it("should properly format updated_by and created_by fields", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall.created_by).toBe("789:testuser");
      expect(insertCall.updated_by).toBe("789:testuser");
    });

    it("should include all required default fields for new repository", async () => {
      mockMaybeSingle.mockResolvedValue({ data: null, error: null });

      await saveTriggerSettings(123, 456, "test-repo", 789, "testuser", mockSettings);

      const insertCall = mockInsert.mock.calls[0][0];
      expect(insertCall).toHaveProperty("repo_rules", "");
      expect(insertCall).toHaveProperty("target_branch", "");
      expect(insertCall).toHaveProperty("use_screenshots", false);
      expect(insertCall).toHaveProperty("production_url", "");
      expect(insertCall).toHaveProperty("local_port", 8080);
      expect(insertCall).toHaveProperty("startup_commands", []);
      expect(insertCall).toHaveProperty("web_urls", []);
      expect(insertCall).toHaveProperty("file_paths", []);
    });
  });
});