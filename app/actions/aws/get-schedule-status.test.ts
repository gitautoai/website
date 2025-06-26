import { GetScheduleCommand, ScheduleState } from "@aws-sdk/client-scheduler";
import { getScheduleStatus } from "./get-schedule-status";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

// Mock dependencies
jest.mock("@/lib/aws-scheduler");
jest.mock("@/utils/get-schedule-name");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;
const mockGetScheduleName = getScheduleName as jest.MockedFunction<typeof getScheduleName>;

describe("getScheduleStatus", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetScheduleName.mockReturnValue("gitauto-repo-123-456");
  });

  it("should return true when schedule is enabled", async () => {
    mockSchedulerClient.send.mockResolvedValueOnce({
      State: ScheduleState.ENABLED,
    });

    const result = await getScheduleStatus(123, 456);

    expect(result).toBe(true);
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
    expect(mockSchedulerClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Name: "gitauto-repo-123-456",
        }
      })
    );
  });

  it("should return false when schedule is disabled", async () => {
    mockSchedulerClient.send.mockResolvedValueOnce({
      State: ScheduleState.DISABLED,
    });

    const result = await getScheduleStatus(123, 456);

    expect(result).toBe(false);
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should return false when schedule does not exist (ResourceNotFoundException)", async () => {
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);

    const result = await getScheduleStatus(123, 456);

    expect(result).toBe(false);
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should throw non-ResourceNotFoundException errors", async () => {
    const otherError = new Error("Some other error");
    otherError.name = "SomeOtherError";
    mockSchedulerClient.send.mockRejectedValueOnce(otherError);

    await expect(getScheduleStatus(123, 456)).rejects.toThrow("Some other error");
    
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should handle different owner and repo IDs", async () => {
    mockGetScheduleName.mockReturnValue("gitauto-repo-999-888");
    mockSchedulerClient.send.mockResolvedValueOnce({
      State: ScheduleState.ENABLED,
    });

    const result = await getScheduleStatus(999, 888);

    expect(result).toBe(true);
    expect(mockGetScheduleName).toHaveBeenCalledWith(999, 888);
  });
});