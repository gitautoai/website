import {
  CreateScheduleCommand,
  UpdateScheduleCommand,
  GetScheduleCommand,
  ScheduleState,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";
import { createCronExpression } from "@/utils/create-cron-expression";
import { createOrUpdateSchedule } from "./create-or-update-schedule";

jest.mock("@/lib/aws-scheduler");
jest.mock("@/utils/get-schedule-name");
jest.mock("@/utils/create-cron-expression");

const mockSchedulerClient = schedulerClient as jest.Mocked<typeof schedulerClient>;
const mockGetScheduleName = getScheduleName as jest.MockedFunction<typeof getScheduleName>;
const mockCreateCronExpression = createCronExpression as jest.MockedFunction<typeof createCronExpression>;

describe("createOrUpdateSchedule", () => {
  const mockConfig = {
    ownerId: 123,
    ownerType: "Organization",
    ownerName: "test-org",
    repoId: 456,
    repoName: "test-repo",
    scheduleTime: "09:00",
    includeWeekends: false,
  };

  const mockScheduleName = "gitauto-repo-123-456";
  const mockCronExpression = "cron(0 9 ? * MON-FRI *)";

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetScheduleName.mockReturnValue(mockScheduleName);
    mockCreateCronExpression.mockReturnValue(mockCronExpression);
    
    process.env.AWS_SCHEDULE_GROUP_NAME = "test-group";
    process.env.AWS_LAMBDA_FUNCTION_ARN = "arn:aws:lambda:us-east-1:123456789012:function:test-function";
    process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN = "arn:aws:iam::123456789012:role/test-role";
  });

  afterEach(() => {
    delete process.env.AWS_SCHEDULE_GROUP_NAME;
    delete process.env.AWS_LAMBDA_FUNCTION_ARN;
    delete process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN;
  });

  it("should create a new schedule when schedule does not exist", async () => {
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    
    mockSchedulerClient.send
      .mockRejectedValueOnce(resourceNotFoundError)
      .mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockGetScheduleName).toHaveBeenCalledWith(123, 456);
    expect(mockCreateCronExpression).toHaveBeenCalledWith("09:00", false);
    
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(2);
    
    const getScheduleCall = mockSchedulerClient.send.mock.calls[0][0];
    expect(getScheduleCall).toBeInstanceOf(GetScheduleCommand);
    expect(getScheduleCall.input).toEqual({
      Name: mockScheduleName,
      GroupName: "test-group",
    });

    const createScheduleCall = mockSchedulerClient.send.mock.calls[1][0];
    expect(createScheduleCall).toBeInstanceOf(CreateScheduleCommand);
    expect(createScheduleCall.input).toEqual({
      Name: mockScheduleName,
      GroupName: "test-group",
      ScheduleExpression: mockCronExpression,
      Target: {
        Arn: "arn:aws:lambda:us-east-1:123456789012:function:test-function",
        RoleArn: "arn:aws:iam::123456789012:role/test-role",
        Input: JSON.stringify({
          ownerId: 123,
          ownerType: "Organization",
          ownerName: "test-org",
          repoId: 456,
          repoName: "test-repo",
          triggerType: "schedule",
          scheduleTime: "09:00",
          includeWeekends: false,
        }),
      },
      FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.OFF,
      },
      State: ScheduleState.ENABLED,
      Description: "GitAuto scheduled trigger for repository test-org/test-repo",
      ActionAfterCompletion: ActionAfterCompletion.NONE,
    });
  });

  it("should update existing schedule when schedule exists", async () => {
    mockSchedulerClient.send
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(2);
    
    const getScheduleCall = mockSchedulerClient.send.mock.calls[0][0];
    expect(getScheduleCall).toBeInstanceOf(GetScheduleCommand);
    
    const updateScheduleCall = mockSchedulerClient.send.mock.calls[1][0];
    expect(updateScheduleCall).toBeInstanceOf(UpdateScheduleCommand);
    expect(updateScheduleCall.input).toEqual({
      Name: mockScheduleName,
      GroupName: "test-group",
      ScheduleExpression: mockCronExpression,
      Target: {
        Arn: "arn:aws:lambda:us-east-1:123456789012:function:test-function",
        RoleArn: "arn:aws:iam::123456789012:role/test-role",
        Input: JSON.stringify({
          ownerId: 123,
          ownerType: "Organization",
          ownerName: "test-org",
          repoId: 456,
          repoName: "test-repo",
          triggerType: "schedule",
          scheduleTime: "09:00",
          includeWeekends: false,
        }),
      },
      FlexibleTimeWindow: {
        Mode: FlexibleTimeWindowMode.OFF,
      },
      State: ScheduleState.ENABLED,
      Description: "GitAuto scheduled trigger for repository test-org/test-repo",
      ActionAfterCompletion: ActionAfterCompletion.NONE,
    });
  });

  it("should handle weekend schedule configuration", async () => {
    const configWithWeekends = { ...mockConfig, includeWeekends: true };
    const weekendCronExpression = "cron(0 9 * * ? *)";
    mockCreateCronExpression.mockReturnValue(weekendCronExpression);
    
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    
    mockSchedulerClient.send
      .mockRejectedValueOnce(resourceNotFoundError)
      .mockResolvedValueOnce({});

    await createOrUpdateSchedule(configWithWeekends);

    expect(mockCreateCronExpression).toHaveBeenCalledWith("09:00", true);
    
    const createScheduleCall = mockSchedulerClient.send.mock.calls[1][0];
    expect(createScheduleCall.input.ScheduleExpression).toBe(weekendCronExpression);
    expect(JSON.parse(createScheduleCall.input.Target.Input).includeWeekends).toBe(true);
  });

  it("should use default group name when AWS_SCHEDULE_GROUP_NAME is not set", async () => {
    delete process.env.AWS_SCHEDULE_GROUP_NAME;
    
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    
    mockSchedulerClient.send
      .mockRejectedValueOnce(resourceNotFoundError)
      .mockResolvedValueOnce({});

    await createOrUpdateSchedule(mockConfig);

    const getScheduleCall = mockSchedulerClient.send.mock.calls[0][0];
    expect(getScheduleCall.input.GroupName).toBe("default");
    
    const createScheduleCall = mockSchedulerClient.send.mock.calls[1][0];
    expect(createScheduleCall.input.GroupName).toBe("default");
  });

  it("should handle different schedule times", async () => {
    const configWithDifferentTime = { ...mockConfig, scheduleTime: "14:30" };
    const afternoonCronExpression = "cron(30 14 ? * MON-FRI *)";
    mockCreateCronExpression.mockReturnValue(afternoonCronExpression);
    
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    
    mockSchedulerClient.send
      .mockRejectedValueOnce(resourceNotFoundError)
      .mockResolvedValueOnce({});

    await createOrUpdateSchedule(configWithDifferentTime);

    expect(mockCreateCronExpression).toHaveBeenCalledWith("14:30", false);
    
    const createScheduleCall = mockSchedulerClient.send.mock.calls[1][0];
    expect(createScheduleCall.input.ScheduleExpression).toBe(afternoonCronExpression);
    expect(JSON.parse(createScheduleCall.input.Target.Input).scheduleTime).toBe("14:30");
  });

  it("should throw error when GetSchedule fails with non-ResourceNotFoundException", async () => {
    const unexpectedError = new Error("Unexpected AWS error");
    unexpectedError.name = "InternalServerError";
    
    mockSchedulerClient.send.mockRejectedValueOnce(unexpectedError);

    await expect(createOrUpdateSchedule(mockConfig)).rejects.toThrow("Unexpected AWS error");
    
    expect(mockSchedulerClient.send).toHaveBeenCalledTimes(1);
  });

  it("should throw error when CreateSchedule fails", async () => {
    const resourceNotFoundError = new Error("Schedule not found");
    resourceNotFoundError.name = "ResourceNotFoundException";
    const createError = new Error("Failed to create schedule");
    
    mockSchedulerClient.send
      .mockRejectedValueOnce(resourceNotFoundError)
      .mockRejectedValueOnce(createError);

    await expect(createOrUpdateSchedule(mockConfig)).rejects.toThrow("Failed to create schedule");
  });

  it("should throw error when UpdateSchedule fails", async () => {
    const updateError = new Error("Failed to update schedule");
    
    mockSchedulerClient.send
      .mockResolvedValueOnce({})
      .mockRejectedValueOnce(updateError);

    await expect(createOrUpdateSchedule(mockConfig)).rejects.toThrow("Failed to update schedule");
  });
});
