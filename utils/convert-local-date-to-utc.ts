export const convertLocalDateToUTC = (
  localDateString: string,
  endOfDay: boolean = false,
): string => {
  const localTime = endOfDay
    ? new Date(`${localDateString}T23:59:59`)
    : new Date(`${localDateString}T00:00:00`);
  return localTime.toISOString().split("T")[0];
};
