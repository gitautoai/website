export function createCronExpression(scheduleTime: string, includeWeekends: boolean) {
  // minute hour day-of-month month day-of-week year
  // * = "any value"
  // ? = "no specific value" (ignore this field)
  const [hours, minutes] = scheduleTime.split(":").map(Number);

  if (includeWeekends) {
    return `cron(${minutes} ${hours} * * ? *)`;
  } else {
    return `cron(${minutes} ${hours} ? * MON-FRI *)`;
  }
}
