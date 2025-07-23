"use server";

import { GetScheduleCommand, ScheduleState } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

export async function getScheduleStatus(ownerId: number, repoId: number) {
  const scheduleName = getScheduleName(ownerId, repoId);

  try {
    const response = await schedulerClient.send(new GetScheduleCommand({ Name: scheduleName }));
    return response.State === ScheduleState.ENABLED;
  } catch (error: any) {
    if (error.name === "ResourceNotFoundException") return false;
    throw error;
  }
}
