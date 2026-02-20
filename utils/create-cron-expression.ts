export function createCronExpression(
  scheduleTimeUTC: string,
  includeWeekends: boolean,
  executionCount: number = 1,
  intervalMinutes: number = 0
) {
  const [startHour, startMinute] = scheduleTimeUTC.split(":").map(Number);
  const dayOfWeek = includeWeekends ? "*" : "MON-FRI";

  // Daily case (executionCount = 1)
  if (executionCount === 1) return [`cron(${startMinute} ${startHour} ? * ${dayOfWeek} *)`];

  // Interval case: generate minutes for each hour
  const hourGroups: { [hour: number]: number[] } = {};

  for (let i = 0; i < executionCount; i++) {
    const totalMinutes = startMinute + i * intervalMinutes;
    const hour = startHour + Math.floor(totalMinutes / 60);
    const minute = totalMinutes % 60;

    if (hour < 24) {
      if (!hourGroups[hour]) hourGroups[hour] = [];
      hourGroups[hour].push(minute);
    }
  }

  // minute hour day-of-month month day-of-week year
  // * = "any value"
  // ? = "no specific value" (ignore this field)
  return Object.entries(hourGroups).map(
    ([hour, minutes]) => `cron(${minutes.join(",")} ${hour} ? * ${dayOfWeek} *)`
  );
}
