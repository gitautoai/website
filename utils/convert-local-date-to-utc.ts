export const convertLocalDateToUTC = (localDateString: string): string => {
  const localMidnight = new Date(`${localDateString}T00:00:00`);
  return localMidnight.toISOString().split("T")[0];
};
