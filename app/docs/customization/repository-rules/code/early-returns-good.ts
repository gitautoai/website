export const earlyReturnsGood = `function processUser(user: User): ProcessResult {
  if (!user) return { error: 'User is required' };
  if (!user.email) return { error: 'Email is required' };
  if (!user.isActive) return { error: 'User is not active' };
  
  // Main logic here - no nesting needed
  return { success: true, data: user };
}`;
