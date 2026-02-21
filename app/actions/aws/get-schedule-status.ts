"use server";

import { GetScheduleCommand, ScheduleState } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

// Returns whether the schedule is enabled
export async function getScheduleStatus(ownerId: number, repoId: number) {
  const scheduleName = getScheduleName(ownerId, repoId);

  try {
    const response = await schedulerClient.send(new GetScheduleCommand({ Name: scheduleName }));
    return response.State === ScheduleState.ENABLED;
  } catch (error) {
    if (error instanceof Error && error.name === "ResourceNotFoundException") return false;
    throw error;
  }
}
