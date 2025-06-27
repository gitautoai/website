export function convertUTCToLocal(utcTimeString: string): string {
  const [utcHours, utcMinutes] = utcTimeString.split(":").map(Number);
  const date = new Date();
  date.setUTCHours(utcHours, utcMinutes, 0, 0);

  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}
