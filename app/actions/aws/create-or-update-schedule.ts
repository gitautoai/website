"use server";

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

interface ScheduleConfig {
  ownerId: number;
  repoId: number;
  scheduleTime: string;
  includeWeekends: boolean;
}

export async function createOrUpdateSchedule(config: ScheduleConfig) {
  const scheduleName = getScheduleName(config.ownerId, config.repoId);
  const cronExpression = createCronExpression(config.scheduleTime, config.includeWeekends);

  const scheduleInput = {
    Name: scheduleName,
    GroupName: process.env.AWS_SCHEDULE_GROUP_NAME || "default",
    ScheduleExpression: cronExpression,
    Target: {
      Arn: process.env.AWS_LAMBDA_FUNCTION_ARN!,
      RoleArn: process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN!,
      Input: JSON.stringify({
        ownerId: config.ownerId,
        repoId: config.repoId,
        triggerType: "schedule",
        scheduleTime: config.scheduleTime,
        includeWeekends: config.includeWeekends,
      }),
    },
    FlexibleTimeWindow: {
      Mode: FlexibleTimeWindowMode.OFF,
    },
    State: ScheduleState.ENABLED,
    Description: `GitAuto scheduled trigger for repository ${config.ownerId}/${config.repoId}`,
    ActionAfterCompletion: ActionAfterCompletion.NONE,
  };

  try {
    await schedulerClient.send(
      new GetScheduleCommand({
        Name: scheduleName,
        GroupName: process.env.AWS_SCHEDULE_GROUP_NAME || "default",
      })
    );
    await schedulerClient.send(new UpdateScheduleCommand(scheduleInput));
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") {
      await schedulerClient.send(new CreateScheduleCommand(scheduleInput));
    } else {
      throw error;
    }
  }
}
