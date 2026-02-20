"use server";

import {
  CreateScheduleCommand,
  ScheduleState,
  FlexibleTimeWindowMode,
  ActionAfterCompletion,
} from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";
import { createCronExpression } from "@/utils/create-cron-expression";
import { deleteSchedules } from "./delete-schedules";

interface ScheduleConfig {
  ownerId: number;
  ownerType: string;
  ownerName: string;
  repoId: number;
  repoName: string;
  userId: number;
  userName: string;
  installationId: number;
  scheduleTimeUTC: string;
  includeWeekends: boolean;
  scheduleExecutionCount: number;
  scheduleIntervalMinutes: number;
}

export async function createOrUpdateSchedule(config: ScheduleConfig) {
  const scheduleName = getScheduleName(config.ownerId, config.repoId);

  // Simplified logic: determine from execution count
  const intervalMinutes = config.scheduleExecutionCount > 1 ? config.scheduleIntervalMinutes : 0;

  const cronExpressions = createCronExpression(
    config.scheduleTimeUTC,
    config.includeWeekends,
    config.scheduleExecutionCount,
    intervalMinutes
  );

  // Delete existing schedules first
  await deleteSchedules(config.ownerId, config.repoId);

  // Create schedules (usually 1-2 cron expressions)
  for (let i = 0; i < cronExpressions.length; i++) {
    const scheduleInput = {
      Name: cronExpressions.length === 1 ? scheduleName : `${scheduleName}-${i + 1}`,
      GroupName: "default",
      ScheduleExpression: cronExpressions[i],
      Target: {
        Arn: process.env.AWS_LAMBDA_FUNCTION_ARN!,
        RoleArn: process.env.AWS_EVENTBRIDGE_SCHEDULER_ROLE_ARN!,
        Input: JSON.stringify({
          ownerId: config.ownerId,
          ownerType: config.ownerType,
          ownerName: config.ownerName,
          repoId: config.repoId,
          repoName: config.repoName,
          userId: config.userId,
          userName: config.userName,
          installationId: config.installationId,
          triggerType: "schedule",
        }),
      },
      FlexibleTimeWindow: { Mode: FlexibleTimeWindowMode.OFF },
      State: ScheduleState.ENABLED,
      Description: `GitAuto scheduled trigger for repository ${config.ownerName}/${config.repoName}`,
      ActionAfterCompletion: ActionAfterCompletion.NONE,
    };

    await schedulerClient.send(new CreateScheduleCommand(scheduleInput));
  }
}
