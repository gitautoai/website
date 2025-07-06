export const testConstantsCentralized = `// tests/constants.ts
export const MOCK_USER = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User'
};

export const MOCK_PRODUCT = {
  id: 1,
  name: 'Test Product',
  price: 99.99
};

// user.test.ts
import { MOCK_USER } from '../tests/constants';`;
