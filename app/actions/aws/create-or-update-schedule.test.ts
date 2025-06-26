import {
  CreateScheduleCommand,
  UpdateScheduleCommand,
  GetScheduleCommand,
  ScheduleState,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";
import { createOrUpdateSchedule } from "./create-or-update-schedule";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";
import { createCronExpression } from "@/utils/create-cron-expression";

// Mock dependencies
jest.mock("@/lib/aws-scheduler");
jest.mock("@/utils/get-schedule-name");
jest.mock("@/utils/create-cron-expression");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;
const mockGetScheduleName = getScheduleName as jest.MockedFunction<typeof getScheduleName>;
const mockCreateCronExpression = createCronExpression as jest.MockedFunction<typeof createCronExpression>;

describe("createOrUpdateSchedule", () => {
  const mockConfig = {
    ownerId: 123,
    repoId: 456,
    scheduleTime: "09:30",
    includeWeekends: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup default mocks
    mockGetScheduleName.mockReturnValue("gitauto-repo-123-456");
    mockCreateCronExpression.mockReturnValue("cron(30 9 ? * MON-FRI *)");
    
    // Setup environment variables
    process.env.AWS_SCHEDULE_GROUP_NAME = "test-group";
    process.env.AWS_LAMBDA_FUNCTION_ARN = "arn:aws:lambda:us-east-1:123456789012:function:test-function";
    process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN = "arn:aws:iam::123456789012:role/test-role";
  });

  afterEach(() => {
    delete process.env.AWS_SCHEDULE_GROUP_NAME;
    delete process.env.AWS_LAMBDA_FUNCTION_ARN;
    delete process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN;
  });

  it("should update existing schedule when schedule exists", async () => {
    // Mock successful GetScheduleCommand (schedule exists)
    mockSchedulerClient.send.mockResolvedValueOnce({});
    // Mock successful UpdateScheduleCommand
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockCreateCronExpression).toHaveBeenCalledWith("09:30", false);
    
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(2);
    
    // Check GetScheduleCommand
    expect(mockSchedulerClient.send).toHaveBeenNthCalledWith(1, 
      expect.objectContaining({
        input: {
          Name: "gitauto-repo-123-456",
          GroupName: "test-group",
        }
      })
    );
    
    // Check UpdateScheduleCommand
    expect(mockSchedulerClient.send).toHaveBeenNthCalledWith(2, 
      expect.objectContaining({
        input: expect.objectContaining({
          Name: "gitauto-repo-123-456",
          GroupName: "test-group",
          ScheduleExpression: "cron(30 9 ? * MON-FRI *)",
          State: ScheduleState.ENABLED,
          FlexibleTimeWindow: {
            Mode: FlexibleTimeWindowMode.OFF,
          },
          ActionAfterCompletion: ActionAfterCompletion.NONE,
        })
      })
    );
  });

  it("should create new schedule when schedule does not exist", async () => {
    // Mock ResourceNotFoundException for GetScheduleCommand
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);
    // Mock successful CreateScheduleCommand
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(2);
    
    // Check CreateScheduleCommand
    expect(mockSchedulerClient.send).toHaveBeenNthCalledWith(2, 
      expect.objectContaining({
        input: expect.objectContaining({
          Name: "gitauto-repo-123-456",
          GroupName: "test-group",
          ScheduleExpression: "cron(30 9 ? * MON-FRI *)",
        })
      })
    );
  });

  it("should use default group name when AWS_SCHEDULE_GROUP_NAME is not set", async () => {
    delete process.env.AWS_SCHEDULE_GROUP_NAME;
    
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockSchedulerClient.send).toHaveBeenNthCalledWith(1, 
      expect.objectContaining({
        input: {
          Name: "gitauto-repo-123-456",
          GroupName: "default",
        }
      })
    );
  });

  it("should include correct target configuration", async () => {
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockSchedulerClient.send).toHaveBeenNthCalledWith(2, 
      expect.objectContaining({
        input: expect.objectContaining({
          Target: {
            Arn: "arn:aws:lambda:us-east-1:123456789012:function:test-function",
            RoleArn: "arn:aws:iam::123456789012:role/test-role",
            Input: JSON.stringify({
              ownerId: 123,
              repoId: 456,
              triggerType: "schedule",
              scheduleTime: "09:30",
              includeWeekends: false,
            }),
          },
        })
      })
    );
  });

  it("should throw error for non-ResourceNotFoundException errors", async () => {
    const otherError = new Error("Some other error");
    otherError.name = "SomeOtherError";
    mockSchedulerClient.send.mockRejectedValueOnce(otherError);

    await expect(createOrUpdateSchedule(mockConfig)).rejects.toThrow("Some other error");
    
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should handle weekend schedule configuration", async () => {
    const weekendConfig = { ...mockConfig, includeWeekends: true };
    mockCreateCronExpression.mockReturnValue("cron(30 9 * * ? *)");
    
    const notFoundError = new Error("Schedule not found");
    notFoundError.name = "ResourceNotFoundException";
    mockSchedulerClient.send.mockRejectedValueOnce(notFoundError);
    mockSchedulerClient.send.mockResolvedValueOnce({});

    await createOrUpdateSchedule(weekendConfig);

    expect(mockCreateCronExpression).toHaveBeenCalledWith("09:30", true);
  });
});