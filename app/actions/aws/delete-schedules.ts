"use server";

import { DeleteScheduleCommand, ListSchedulesCommand } from "@aws-sdk/client-scheduler";
import { schedulerClient } from "@/lib/aws-scheduler";
import { getScheduleName } from "@/utils/get-schedule-name";

export async function deleteSchedules(ownerId: number, repoId: number) {
  const baseScheduleName = getScheduleName(ownerId, repoId);

  try {
    // List all schedules that start with the base name
    const listResponse = await schedulerClient.send(
      new ListSchedulesCommand({ NamePrefix: baseScheduleName })
    );

    // Delete all matching schedules
    if (listResponse.Schedules) {
      for (const schedule of listResponse.Schedules) {
        // Skip if no name
        if (!schedule.Name) continue;

        // Delete the schedule
        try {
          await schedulerClient.send(new DeleteScheduleCommand({ Name: schedule.Name }));
        } catch (error: any) {
          if (error.name !== "ResourceNotFoundException") throw error;
        }
      }
    }
  } catch (error: any) {
    if (error.name !== "ResourceNotFoundException") throw error;
  }
}
