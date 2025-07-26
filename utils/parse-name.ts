export const parseName = (fullName: string) => {
  const nameParts = fullName
    .replace(/\s*\([^)]*\)\s*/g, " ")
    .trim()
    .split(/\s+/);
  
  return {
    firstName: nameParts[0] || fullName,
    lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
  };
};
