/**
 * Check if a user is an admin
 * Currently only hiroshinishio (user ID: 4620828) has admin privileges
 *
 * To get GitHub user ID: curl -s https://api.github.com/users/USERNAME | jq '.id'
 */
export const isAdmin = (userId: number | null | undefined): boolean => {
  if (!userId) return false;
  return userId === 4620828;
};
