"use server";

import { DeleteScheduleCommand } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

export async function deleteSchedule(ownerId: number, repoId: number) {
  const scheduleName = getScheduleName(ownerId, repoId);

  try {
    await schedulerClient.send(new DeleteScheduleCommand({ Name: scheduleName }));
  } catch (error: any) {
    if (error.name !== "ResourceNotFoundException") {
      throw error;
    }
  }
}
