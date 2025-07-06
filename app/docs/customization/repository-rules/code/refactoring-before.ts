export const refactoringBefore = `function validateAndSaveUser(userData) {
  // Hard to test: validation and database mixed together
  if (!userData.email || !userData.email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  if (!userData.name || userData.name.length < 2) {
    throw new Error('Invalid name');
  }
  
  // Database call mixed with validation logic
  const existingUser = database.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const user = {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    createdAt: new Date()
  };
  
  database.save(user);
  return user;
}`;
