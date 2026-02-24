export const generateRandomDelay = (minMinutes: number, maxMinutes: number) => {
  const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return new Date(Date.now() + randomMinutes * 60 * 1000);
};
