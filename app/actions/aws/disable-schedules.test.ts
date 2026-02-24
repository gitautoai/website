import { disableSchedules } from "./disable-schedules";
import { schedulerClient } from "@/lib/aws-scheduler";
import {
  GetScheduleCommand,
  ListSchedulesCommand,
  ScheduleState,
  UpdateScheduleCommand,
} from "@aws-sdk/client-scheduler";

jest.mock("@/lib/aws-scheduler", () => ({
  schedulerClient: { send: jest.fn() },
}));

jest.mock("@/utils/get-schedule-name", () => ({
  getScheduleName: jest.fn().mockReturnValue("gitauto-repo-123-456"),
}));

const mockSend = schedulerClient.send as jest.Mock;

describe("disableSchedules", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disables a single schedule", async () => {
    // ListSchedules returns one schedule
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: "gitauto-repo-123-456" }],
    });

    // GetSchedule returns full details
    mockSend.mockResolvedValueOnce({
      GroupName: "default",
      ScheduleExpression: "cron(0 17 ? * MON-FRI *)",
      Target: {
        Arn: "arn:aws:lambda:us-west-1:123:function:pr-agent-prod",
        RoleArn: "arn:aws:iam::123:role/scheduler-role",
        Input: '{"ownerId":123}',
      },
      FlexibleTimeWindow: { Mode: "OFF" },
      Description: "test schedule",
      ActionAfterCompletion: "NONE",
    });

    // UpdateSchedule succeeds
    mockSend.mockResolvedValueOnce({});

    await disableSchedules(123, 456);

    expect(mockSend).toHaveBeenCalledTimes(3);

    // Verify ListSchedules was called with correct prefix
    expect(mockSend.mock.calls[0][0]).toBeInstanceOf(ListSchedulesCommand);

    // Verify GetSchedule was called
    expect(mockSend.mock.calls[1][0]).toBeInstanceOf(GetScheduleCommand);

    // Verify UpdateSchedule was called with DISABLED state
    const updateCall = mockSend.mock.calls[2][0];
    expect(updateCall).toBeInstanceOf(UpdateScheduleCommand);
    expect(updateCall.input.State).toBe(ScheduleState.DISABLED);
    expect(updateCall.input.Name).toBe("gitauto-repo-123-456");
  });

  it("disables multiple schedules (with suffix)", async () => {
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: "gitauto-repo-123-456-1" }, { Name: "gitauto-repo-123-456-2" }],
    });

    // GetSchedule for first schedule
    mockSend.mockResolvedValueOnce({
      GroupName: "default",
      ScheduleExpression: "cron(0 17 ? * MON-FRI *)",
      Target: { Arn: "arn:test", RoleArn: "arn:role" },
      FlexibleTimeWindow: { Mode: "OFF" },
    });
    // UpdateSchedule for first
    mockSend.mockResolvedValueOnce({});

    // GetSchedule for second schedule
    mockSend.mockResolvedValueOnce({
      GroupName: "default",
      ScheduleExpression: "cron(15 17 ? * MON-FRI *)",
      Target: { Arn: "arn:test", RoleArn: "arn:role" },
      FlexibleTimeWindow: { Mode: "OFF" },
    });
    // UpdateSchedule for second
    mockSend.mockResolvedValueOnce({});

    await disableSchedules(123, 456);

    // 1 List + 2 Get + 2 Update = 5
    expect(mockSend).toHaveBeenCalledTimes(5);

    // Both updates should set DISABLED
    const update1 = mockSend.mock.calls[2][0];
    expect(update1).toBeInstanceOf(UpdateScheduleCommand);
    expect(update1.input.State).toBe(ScheduleState.DISABLED);
    expect(update1.input.Name).toBe("gitauto-repo-123-456-1");

    const update2 = mockSend.mock.calls[4][0];
    expect(update2).toBeInstanceOf(UpdateScheduleCommand);
    expect(update2.input.State).toBe(ScheduleState.DISABLED);
    expect(update2.input.Name).toBe("gitauto-repo-123-456-2");
  });

  it("does nothing when no schedules found", async () => {
    mockSend.mockResolvedValueOnce({ Schedules: [] });

    await disableSchedules(123, 456);

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("does nothing when Schedules is undefined", async () => {
    mockSend.mockResolvedValueOnce({});

    await disableSchedules(123, 456);

    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("skips schedules with no Name", async () => {
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: undefined }, { Name: "" }],
    });

    await disableSchedules(123, 456);

    // Only the List call, no Get/Update
    expect(mockSend).toHaveBeenCalledTimes(1);
  });

  it("silently handles ResourceNotFoundException on GetSchedule", async () => {
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: "gitauto-repo-123-456" }],
    });

    const error = new Error("Schedule not found");
    error.name = "ResourceNotFoundException";
    mockSend.mockRejectedValueOnce(error);

    // Should NOT throw
    await disableSchedules(123, 456);

    expect(mockSend).toHaveBeenCalledTimes(2);
  });

  it("re-throws non-ResourceNotFoundException on GetSchedule", async () => {
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: "gitauto-repo-123-456" }],
    });

    const error = new Error("Access denied");
    error.name = "AccessDeniedException";
    mockSend.mockRejectedValueOnce(error);

    await expect(disableSchedules(123, 456)).rejects.toThrow("Access denied");
  });

  it("re-throws non-ResourceNotFoundException on UpdateSchedule", async () => {
    mockSend.mockResolvedValueOnce({
      Schedules: [{ Name: "gitauto-repo-123-456" }],
    });

    mockSend.mockResolvedValueOnce({
      GroupName: "default",
      ScheduleExpression: "cron(0 17 ? * MON-FRI *)",
      Target: { Arn: "arn:test", RoleArn: "arn:role" },
      FlexibleTimeWindow: { Mode: "OFF" },
    });

    const error = new Error("Validation error");
    error.name = "ValidationException";
    mockSend.mockRejectedValueOnce(error);

    await expect(disableSchedules(123, 456)).rejects.toThrow("Validation error");
  });

  it("silently handles ResourceNotFoundException on ListSchedules", async () => {
    const error = new Error("Not found");
    error.name = "ResourceNotFoundException";
    mockSend.mockRejectedValueOnce(error);

    await disableSchedules(123, 456);

    expect(mockSend).toHaveBeenCalledTimes(1);
  });
});
