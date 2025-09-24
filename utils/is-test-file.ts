/**
 * Check if a file is a test file (same logic as gitauto schedule handler)
 */
export function isTestFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") return false;

  const filenameLower = filename.toLowerCase();

  const testPatterns = [
    /\.test\./, // Button.test.tsx, utils.test.js
    /\.spec\./, // Button.spec.tsx, api.spec.js
    /test\./, // ButtonTest.java, UserTest.cs - but we'll use better filtering below
    /tests\./, // ButtonTests.java, UserTests.cs - but we'll use better filtering below
    /_test\./, // button_test.py, user_test.go
    /_spec\./, // button_spec.rb, user_spec.rb
    /^test_/, // test_button.py, test_utils.py
    /\/test_/, // services/anthropic/test_client.py
    /^spec_/, // spec_button.rb, spec_helper.rb
    /\/spec_/, // services/anthropic/spec_client.py
    /\/__tests__\//, // src/__tests__/Button.tsx
    /\/tests?\//, // src/tests/Button.tsx, src/test/Button.java
    /^tests?\//, // tests/constants.py, test/utils.py
    /\/e2e\//, // e2e/login.spec.ts
    /(^|\/)cypress\//, // cypress/integration/login.js
    /\/playwright\//, // playwright/tests/login.spec.ts
    /\/spec\//, // spec/models/user_spec.rb
    /\/testing\//, // testing/utils.py (directory path only)
    /^testing\//, // testing/utils.py (start of path)
    /\/__mocks__\//, // src/__mocks__/api.js
    /\.mock\./, // api.mock.ts, database.mock.js
    /mock\./, // ApiMock.java, DatabaseMock.cs - but we'll use better filtering below
    /mocks\./, // ApiMocks.java, DatabaseMocks.cs - but we'll use better filtering below
    /^test\./, // test.js, test.py
    /^spec\./, // spec.rb, spec.js
    /^\.github\//, // .github/scripts/*, .github/workflows/*
  ];

  // Check if any pattern matches
  const matches = testPatterns.some((pattern) => pattern.test(filenameLower));

  if (!matches) return false;

  // Additional filtering to prevent false positives
  // Patterns that should NOT be considered test files even if they match broad patterns
  const excludePatterns = [
    /^setuptest/, // setupTests.js, setupTest.js - configuration files
    /^testthat$/, // testThat.js - utility library, not tests
    /contest/, // contest.js - contains "test" but not a test file
    /protest/, // protest.js - contains "test" but not a test file
    /latest/, // latest.py - contains "test" but not a test file
    /fastest/, // fastest.js - contains "test" but not a test file
    /greatest/, // greatest.js - contains "test" but not a test file
    /\btestenviron/, // testEnvironment.js - configuration, not test
    /testutils?$/, // testUtils.js, testUtil.js - utility files, not tests
    /testhelper/, // testHelper.js - helper files, not tests
    /testconfig/, // testConfig.js - config files, not tests
    /testsetup/, // testSetup.js - setup files, not tests
  ];

  // If any exclude pattern matches, it's not a test file
  if (excludePatterns.some((pattern) => pattern.test(filenameLower))) {
    return false;
  }

  return true;
}
