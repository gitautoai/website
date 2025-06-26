import { createOrUpdateSchedule } from "@/app/actions/aws/create-or-update-schedule";
import { deleteSchedule } from "@/app/actions/aws/delete-schedule";
import { getScheduleStatus } from "@/app/actions/aws/get-schedule-status";
import { schedulerClient } from "@/lib/aws-scheduler";

// Mock the AWS SDK
jest.mock("@/lib/aws-scheduler");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;

describe("AWS Scheduler Integration", () => {
  const testConfig = {
    ownerId: 123,
    repoId: 456,
    scheduleTime: "09:30",
    includeWeekends: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("complete workflow", () => {
    it("should create, check status, and delete schedule successfully", async () => {
      // Mock create schedule (schedule doesn't exist initially)
      const notFoundError = new Error("Schedule not found");
      notFoundError.name = "ResourceNotFoundException";
      mockSchedulerClient.send
        .mockRejectedValueOnce(notFoundError) // GetScheduleCommand fails
        .mockResolvedValueOnce({}) // CreateScheduleCommand succeeds
        .mockResolvedValueOnce({ State: "ENABLED" }) // GetScheduleCommand for status check
        .mockResolvedValueOnce({}); // DeleteScheduleCommand succeeds

      // Create schedule
      await createOrUpdateSchedule(testConfig);

      // Check status
      const status = await getScheduleStatus(testConfig.ownerId, testConfig.repoId);
      expect(status).toBe(true);

      // Delete schedule
      await deleteSchedule(testConfig.ownerId, testConfig.repoId);

      expect(mockSchedulerClient.send).toHaveBeenCalledTimes(4);
    });

    it("should handle update existing schedule workflow", async () => {
      // Mock update schedule (schedule exists)
      mockSchedulerClient.send
        .mockResolvedValueOnce({}) // GetScheduleCommand succeeds
        .mockResolvedValueOnce({}) // UpdateScheduleCommand succeeds
        .mockResolvedValueOnce({ State: "ENABLED" }); // GetScheduleCommand for status check

      // Update existing schedule
      await createOrUpdateSchedule(testConfig);

      // Check status
      const status = await getScheduleStatus(testConfig.ownerId, testConfig.repoId);
      expect(status).toBe(true);

      expect(mockSchedulerClient.send).toHaveBeenCalledTimes(3);
    });
  });

  describe("error handling", () => {
    it("should handle AWS service errors gracefully", async () => {
      const serviceError = new Error("Service unavailable");
      serviceError.name = "ServiceUnavailableException";
      mockSchedulerClient.send.mockRejectedValue(serviceError);

      await expect(createOrUpdateSchedule(testConfig)).rejects.toThrow("Service unavailable");
      await expect(getScheduleStatus(testConfig.ownerId, testConfig.repoId)).rejects.toThrow("Service unavailable");
      await expect(deleteSchedule(testConfig.ownerId, testConfig.repoId)).rejects.toThrow("Service unavailable");
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      networkError.name = "NetworkingError";
      mockSchedulerClient.send.mockRejectedValue(networkError);

      await expect(createOrUpdateSchedule(testConfig)).rejects.toThrow("Network error");
    });

    it("should handle permission errors", async () => {
      const permissionError = new Error("Access denied");
      permissionError.name = "UnauthorizedOperation";
      mockSchedulerClient.send.mockRejectedValue(permissionError);

      await expect(createOrUpdateSchedule(testConfig)).rejects.toThrow("Access denied");
    });
  });
});