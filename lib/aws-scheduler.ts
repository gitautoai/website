import { SchedulerClient } from "@aws-sdk/client-scheduler";

export const schedulerClient = new SchedulerClient({
  region: process.env.AWS_REGION || "us-west-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});
