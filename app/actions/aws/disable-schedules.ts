"use server";

import {
  GetScheduleCommand,
  ListSchedulesCommand,
  ScheduleState,
  UpdateScheduleCommand,
} from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

export async function disableSchedules(ownerId: number, repoId: number) {
  const baseScheduleName = getScheduleName(ownerId, repoId);

  try {
    const listResponse = await schedulerClient.send(
      new ListSchedulesCommand({ NamePrefix: baseScheduleName }),
    );

    if (listResponse.Schedules) {
      for (const schedule of listResponse.Schedules) {
        if (!schedule.Name) continue;

        try {
          const existing = await schedulerClient.send(
            new GetScheduleCommand({ Name: schedule.Name }),
          );

          await schedulerClient.send(
            new UpdateScheduleCommand({
              Name: schedule.Name,
              GroupName: existing.GroupName,
              ScheduleExpression: existing.ScheduleExpression,
              Target: existing.Target,
              FlexibleTimeWindow: existing.FlexibleTimeWindow,
              State: ScheduleState.DISABLED,
              Description: existing.Description,
              ActionAfterCompletion: existing.ActionAfterCompletion,
            }),
          );
        } catch (error) {
          if (error instanceof Error && error.name !== "ResourceNotFoundException") throw error;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error && error.name !== "ResourceNotFoundException") throw error;
  }
}
