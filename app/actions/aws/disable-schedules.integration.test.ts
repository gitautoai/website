import {
  CreateScheduleCommand,
  FlexibleTimeWindowMode,
  GetScheduleCommand,
  ScheduleState,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { disableSchedules } from "./disable-schedules";
import { deleteSchedules } from "./delete-schedules";

// Integration test: uses real AWS EventBridge Scheduler
// Requires AWS credentials in .env.local
const TEST_OWNER_ID = 999999999;
const TEST_REPO_ID = 888888888;
const SCHEDULE_NAME = `gitauto-repo-${TEST_OWNER_ID}-${TEST_REPO_ID}`;

jest.mock("@/utils/get-schedule-name", () => ({
  getScheduleName: (ownerId: number, repoId: number) => `gitauto-repo-${ownerId}-${repoId}`,
}));

// Skip if AWS credentials are not configured
const hasCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
const describeIf = hasCredentials ? describe : describe.skip;

describeIf("disableSchedules (integration)", () => {
  // Clean up before and after each test
  beforeEach(async () => {
    await deleteSchedules(TEST_OWNER_ID, TEST_REPO_ID);
  });

  afterEach(async () => {
    await deleteSchedules(TEST_OWNER_ID, TEST_REPO_ID);
  });

  it("creates a schedule then disables it", async () => {
    // Step 1: Create a schedule (same way createOrUpdateSchedule does)
    await schedulerClient.send(
      new CreateScheduleCommand({
        Name: SCHEDULE_NAME,
        GroupName: "default",
        ScheduleExpression: "cron(0 17 ? * MON-FRI *)",
        Target: {
          Arn: process.env.AWS_LAMBDA_FUNCTION_ARN!,
          RoleArn: process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN!,
          Input: JSON.stringify({
            ownerId: TEST_OWNER_ID,
            repoId: TEST_REPO_ID,
            triggerType: "schedule",
          }),
        },
        FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
        State: ScheduleState.ENABLED,
        Description: "Integration test schedule",
        ActionAfterCompletion: ActionAfterCompletion.NONE,
      }),
    );

    // Step 2: Verify it was created and is ENABLED
    const before = await schedulerClient.send(new GetScheduleCommand({ Name: SCHEDULE_NAME }));
    expect(before.State).toBe(ScheduleState.ENABLED);

    // Step 3: Disable it using the function under test
    await disableSchedules(TEST_OWNER_ID, TEST_REPO_ID);

    // Step 4: Verify it is now DISABLED
    const after = await schedulerClient.send(new GetScheduleCommand({ Name: SCHEDULE_NAME }));
    expect(after.State).toBe(ScheduleState.DISABLED);
  }, 30000);

  it("creates multiple schedules (with suffix) then disables all", async () => {
    // Create two schedules with suffix pattern
    for (const suffix of ["-1", "-2"]) {
      await schedulerClient.send(
        new CreateScheduleCommand({
          Name: `${SCHEDULE_NAME}${suffix}`,
          GroupName: "default",
          ScheduleExpression: "cron(0 17 ? * MON-FRI *)",
          Target: {
            Arn: process.env.AWS_LAMBDA_FUNCTION_ARN!,
            RoleArn: process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN!,
            Input: JSON.stringify({
              ownerId: TEST_OWNER_ID,
              repoId: TEST_REPO_ID,
              triggerType: "schedule",
            }),
          },
          FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
          State: ScheduleState.ENABLED,
          Description: "Integration test schedule",
          ActionAfterCompletion: ActionAfterCompletion.NONE,
        }),
      );
    }

    // Verify both are ENABLED
    for (const suffix of ["-1", "-2"]) {
      const before = await schedulerClient.send(
        new GetScheduleCommand({ Name: `${SCHEDULE_NAME}${suffix}` }),
      );
      expect(before.State).toBe(ScheduleState.ENABLED);
    }

    // Disable all
    await disableSchedules(TEST_OWNER_ID, TEST_REPO_ID);

    // Verify both are DISABLED
    for (const suffix of ["-1", "-2"]) {
      const after = await schedulerClient.send(
        new GetScheduleCommand({ Name: `${SCHEDULE_NAME}${suffix}` }),
      );
      expect(after.State).toBe(ScheduleState.DISABLED);
    }
  }, 30000);
});
