export const convertUTCDateToLocal = (utcDateString: string): string => {
  const utcMidnight = new Date(`${utcDateString}T00:00:00Z`);
  const year = utcMidnight.getFullYear();
  const month = (utcMidnight.getMonth() + 1).toString().padStart(2, "0");
  const day = utcMidnight.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};
