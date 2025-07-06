export const testConstantsAuto = `// If GitAuto finds this pattern in existing tests:
const MOCK_USER = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User'
};

// It will use the same pattern in new tests
const MOCK_PRODUCT = {
  id: 1,
  name: 'Test Product',
  price: 99.99
};`;
