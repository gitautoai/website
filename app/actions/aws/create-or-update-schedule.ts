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
  ownerType: string;
  ownerName: string;
  repoId: number;
  repoName: string;
  userId: number;
  userName: string;
  installationId: number;
  scheduleTimeUTC: string;
  includeWeekends: boolean;
}

export async function createOrUpdateSchedule(config: ScheduleConfig) {
  const scheduleName = getScheduleName(config.ownerId, config.repoId);
  const cronExpression = createCronExpression(config.scheduleTimeUTC, config.includeWeekends);

  const scheduleInput = {
    Name: scheduleName,
    GroupName: "default",
    ScheduleExpression: cronExpression,
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
        scheduleTimeUTC: config.scheduleTimeUTC,
        includeWeekends: config.includeWeekends,
      }),
    },
    FlexibleTimeWindow: {
      Mode: FlexibleTimeWindowMode.OFF,
    },
    State: ScheduleState.ENABLED,
    Description: `GitAuto scheduled trigger for repository ${config.ownerName}/${config.repoName}`,
    ActionAfterCompletion: ActionAfterCompletion.NONE,
  };

  try {
    await schedulerClient.send(
      new GetScheduleCommand({
        Name: scheduleName,
        GroupName: "default",
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
