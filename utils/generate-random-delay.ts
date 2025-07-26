export const generateRandomDelay = () => {
  const minMinutes = 30;
  const maxMinutes = 60;
  const randomMinutes = Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) + minMinutes;
  return new Date(Date.now() + randomMinutes * 60 * 1000);
};