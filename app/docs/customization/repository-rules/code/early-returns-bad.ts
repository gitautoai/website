export const earlyReturnsBad = `function processUser(user: User): ProcessResult {
  if (user) {
    if (user.email) {
      if (user.isActive) {
        // Main logic buried deep inside
        return { success: true, data: user };
      } else {
        return { error: 'User is not active' };
      }
    } else {
      return { error: 'Email is required' };
    }
  } else {
    return { error: 'User is required' };
  }
}`;
