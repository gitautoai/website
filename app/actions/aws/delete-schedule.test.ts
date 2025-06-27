import { DeleteScheduleCommand } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";
import { deleteSchedule } from "./delete-schedule";

jest.mock("@/lib/aws-scheduler");
jest.mock("@/utils/get-schedule-name");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;
const mockGetScheduleName = getScheduleName as jest.MockedFunction<typeof getScheduleName>;

describe("deleteSchedule", () => {
  const mockOwnerId = 123;
  const mockRepoId = 456;
  const mockScheduleName = "gitauto-repo-123-456";

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetScheduleName.mockReturnValue(mockScheduleName);
  });

  it("should successfully delete an existing schedule", async () => {
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await deleteSchedule(mockOwnerId, mockRepoId);

    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
    
    const deleteCommand = mockSchedulerClient.send.mock.calls[0][0];
    expect(deleteCommand).toBeInstanceOf(DeleteScheduleCommand);
    expect(deleteCommand.input).toEqual({
      Name: mockScheduleName,
    });
  });

  it("should ignore ResourceNotFoundException when schedule does not exist", async () => {
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    
    mockSchedulerClient.send.mockRejectedValueOnce(resourceNotFoundError);

    await expect(deleteSchedule(mockOwnerId, mockRepoId)).resolves.toBeUndefined();
    
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should throw error for non-ResourceNotFoundException errors", async () => {
    const unexpectedError = new Error("Unexpected AWS error");
    unexpectedError.name = "InternalServerError";
    
    mockSchedulerClient.send.mockRejectedValueOnce(unexpectedError);

    await expect(deleteSchedule(mockOwnerId, mockRepoId)).rejects.toThrow("Unexpected AWS error");
    
    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should handle different owner and repo IDs", async () => {
    const differentOwnerId = 789;
    const differentRepoId = 101112;
    const differentScheduleName = "gitauto-repo-789-101112";
    
    mockGetScheduleName.mockReturnValue(differentScheduleName);
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await deleteSchedule(differentOwnerId, differentRepoId);

    expect(mockGetScheduleName).toHaveBeenCalledWith(789, 101112);
    
    const deleteCommand = mockSchedulerClient.send.mock.calls[0][0];
    expect(deleteCommand.input).toEqual({
      Name: differentScheduleName,
    });
  });
});
