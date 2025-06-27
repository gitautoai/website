export function convertLocalToUTC(localTimeString: string): string {
  const [localHours, localMinutes] = localTimeString.split(":").map(Number);
  const localTime = new Date();
  localTime.setHours(localHours, localMinutes, 0, 0);

  const utcHours = localTime.getUTCHours();
  const utcMinutes = localTime.getUTCMinutes();

  return `${utcHours.toString().padStart(2, "0")}:${utcMinutes.toString().padStart(2, "0")}`;
}
