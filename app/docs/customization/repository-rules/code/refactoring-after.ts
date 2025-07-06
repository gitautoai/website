export const refactoringAfter = `// validate-user-data.ts
export function validateUserData(userData) {
  if (!userData.email || !userData.email.includes('@')) {
    throw new Error('Invalid email');
  }
  
  if (!userData.name || userData.name.length < 2) {
    throw new Error('Invalid name');
  }
}

// create-user.ts
export function createUser(userData) {
  return {
    id: generateId(),
    email: userData.email.toLowerCase(),
    name: userData.name.trim(),
    createdAt: new Date()
  };
}

// validate-and-save-user.ts
import { validateUserData } from './validate-user-data';
import { createUser } from './create-user';

export function validateAndSaveUser(userData, userRepository) {
  validateUserData(userData);
  
  const existingUser = userRepository.findByEmail(userData.email);
  if (existingUser) {
    throw new Error('User already exists');
  }
  
  const user = createUser(userData);
  userRepository.save(user);
  return user;
}`;
