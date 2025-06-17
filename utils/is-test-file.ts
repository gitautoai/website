/**
 * Test file patterns with real examples
 */
const TEST_FILE_PATTERNS = [
  // Test file naming patterns
  /\.test\./, // Button.test.tsx, utils.test.js
  /\.spec\./, // Button.spec.tsx, api.spec.js
  /Test\./, // ButtonTest.java, UserTest.cs
  /Tests\./, // ButtonTests.java, UserTests.cs
  /_test\./, // button_test.py, user_test.go
  /_spec\./, // button_spec.rb, user_spec.rb
  /test_/, // test_button.py, test_utils.py
  /spec_/, // spec_button.rb, spec_helper.rb

  // Test directories
  /\/__tests__\//, // src/__tests__/Button.tsx
  /\/tests?\//, // src/tests/Button.tsx, src/test/Button.java
  /\/e2e\//, // e2e/login.spec.ts
  /\/cypress\//, // cypress/integration/login.js
  /\/playwright\//, // playwright/tests/login.spec.ts
  /\/spec\//, // spec/models/user_spec.rb
  /\/testing\//, // testing/utils.py

  // Mock files
  /\/__mocks__\//, // src/__mocks__/api.js
  /\.mock\./, // api.mock.ts, database.mock.js
  /Mock\./, // ApiMock.java, DatabaseMock.cs
  /Mocks\./, // ApiMocks.java, DatabaseMocks.cs

  // Common test file names
  /^test\./, // test.js, test.py (root level test files)
  /^spec\./, // spec.rb, spec.js (root level spec files)
];

/**
 * Check if a file path matches test file patterns
 */
export function isTestFile(filePath: string): boolean {
  return TEST_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}
 