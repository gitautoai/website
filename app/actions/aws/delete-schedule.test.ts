import { DeleteScheduleCommand } from "@aws-sdk/client-scheduler";
import { deleteSchedule } from "./delete-schedule";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

// Mock dependencies
jest.mock("@/lib/aws-scheduler");
jest.mock("@/utils/get-schedule-name");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;
const mockGetScheduleName = getScheduleName as jest.MockedFunction<typeof getScheduleName>;

describe("deleteSchedule", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetScheduleName.mockReturnValue("gitauto-repo-123-456");
  });

  it("should delete schedule successfully", async () => {
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await deleteSchedule(123, 456);

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

  it("should ignore ResourceNotFoundException errors", async () => {
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);

    // Should not throw
    await expect(deleteSchedule(123, 456)).resolves.toBeUndefined();
    
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should throw non-ResourceNotFoundException errors", async () => {
    const otherError = new Error("Some other error");
    otherError.name = "SomeOtherError";
    mockSchedulerClient.send.mockRejectedValueOnce(otherError);

    await expect(deleteSchedule(123, 456)).rejects.toThrow("Some other error");
    
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should handle different owner and repo IDs", async () => {
    mockGetScheduleName.mockReturnValue("gitauto-repo-999-888");
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await deleteSchedule(999, 888);

    expect(mockGetScheduleName).toHaveBeenCalledWith(999, 888);
    expect(mockSchedulerClient.send).toHaveBeenCalledWith(
      expect.objectContaining({
        input: {
          Name: "gitauto-repo-999-888",
        }
      })
    );
  });
});