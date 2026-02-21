"use server";

import { GetScheduleCommand } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

export async function scheduleExists(ownerId: number, repoId: number) {
  const scheduleName = getScheduleName(ownerId, repoId);

  try {
    await schedulerClient.send(new GetScheduleCommand({ Name: scheduleName }));
    return true;
  } catch (error) {
    if (error instanceof Error && error.name === "ResourceNotFoundException") return false;
    throw error;
  }
}
