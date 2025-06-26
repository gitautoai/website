import {
  SchedulerClient,
  CreateScheduleCommand,
  UpdateScheduleCommand,
  GetScheduleCommand,
  DeleteScheduleCommand,
  ScheduleState,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";

// This test ensures that our AWS SDK imports and types are working correctly
describe("AWS SDK Imports and Types", () => {
  it("should import SchedulerClient correctly", () => {
    expect(SchedulerClient).toBeDefined();
  });

  it("should import all required commands", () => {
    expect(CreateScheduleCommand).toBeDefined();
    expect(UpdateScheduleCommand).toBeDefined();
    expect(GetScheduleCommand).toBeDefined();
    expect(DeleteScheduleCommand).toBeDefined();
  });

  it("should import all required enums", () => {
    expect(ScheduleState).toBeDefined();
    expect(ScheduleState.ENABLED).toBeDefined();
    expect(ScheduleState.DISABLED).toBeDefined();
    
    expect(FlexibleTimeWindowMode).toBeDefined();
    expect(FlexibleTimeWindowMode.OFF).toBeDefined();
    
    expect(ActionAfterCompletion).toBeDefined();
    expect(ActionAfterCompletion.NONE).toBeDefined();
  });

  it("should create command instances", () => {
    const createCommand = new CreateScheduleCommand({ Name: "test" });
    const updateCommand = new UpdateScheduleCommand({ Name: "test" });
    const getCommand = new GetScheduleCommand({ Name: "test" });
    const deleteCommand = new DeleteScheduleCommand({ Name: "test" });

    expect(createCommand).toBeInstanceOf(CreateScheduleCommand);
    expect(updateCommand).toBeInstanceOf(UpdateScheduleCommand);
    expect(getCommand).toBeInstanceOf(GetScheduleCommand);
    expect(deleteCommand).toBeInstanceOf(DeleteScheduleCommand);
  });
});