/**
 * Check if a file is a test file (same logic as gitauto schedule handler)
 */
export function isTestFile(filename: string): boolean {
  if (!filename || typeof filename !== "string") return false;

  const filenameLower = filename.toLowerCase();

  // Strong patterns: Unambiguous test file indicators (no false positives)
  // If these match, it's definitely a test file - skip weak exclude patterns
  const strongTestPatterns = [
    /\.test\./, // Button.test.tsx, utils.test.js
    /\.spec\./, // Button.spec.tsx, api.spec.js
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
    /^test\./, // test.js, test.py
    /^spec\./, // spec.rb, spec.js
    /^\.github\//, // .github/scripts/*, .github/workflows/*
    // Snapshot files (Jest, Vitest, etc.)
    /\/__snapshots__\//, // __snapshots__/Button.test.tsx.snap
    /\.snap$/, // any .snap file
    // Test fixtures and data
    /(^|\/)__fixtures__\//, // __fixtures__/user.json
    /(^|\/)fixtures\//, // fixtures/sample_data.json
    /\.fixture\./, // user.fixture.ts
    // Test configuration files
    /jest\.config\./, // jest.config.js, jest.config.ts
    /vitest\.config\./, // vitest.config.js
    /karma\.conf\./, // karma.conf.js
    /^setuptest/, // setupTests.js, setupTest.js
    /^testutil/, // testUtils.js, testUtil.js
    /^testhelper/, // testHelper.js
    /^testconfig/, // testConfig.js
    /^testsetup/, // testSetup.js
    /testenviron/, // testEnvironment.js - test environment config
    // Storybook files (visual testing)
    /\.stories\./, // Button.stories.tsx
    /(^|\/)stories\//, // stories/Button.tsx
  ];

  // Check strong patterns first - if matched, it's definitely a test file
  if (strongTestPatterns.some((pattern) => pattern.test(filenameLower))) {
    return true;
  }

  // Weak patterns: Can have false positives (e.g., "latest" matches "test.")
  // These require stricter exclusion filtering
  const weakTestPatterns = [
    /test\./, // ButtonTest.java, UserTest.cs - but also matches "latest.py"
    /tests\./, // ButtonTests.java, UserTests.cs
    /mock\./, // ApiMock.java, DatabaseMock.cs
    /mocks\./, // ApiMocks.java, DatabaseMocks.cs
  ];

  // Check weak patterns
  const matchesWeakPattern = weakTestPatterns.some((pattern) => pattern.test(filenameLower));

  if (!matchesWeakPattern) return false;

  // Additional filtering to prevent false positives from weak patterns
  const weakExcludePatterns = [
    /contest/, // contest.js - contains "test" but not a test file
    /protest/, // protest.js - contains "test" but not a test file
    /latest/, // latest.py - contains "test" but not a test file
    /fastest/, // fastest.js - contains "test" but not a test file
    /greatest/, // greatest.js - contains "test" but not a test file
  ];

  // If any exclude pattern matches, it's not a test file
  return !weakExcludePatterns.some((pattern) => pattern.test(filenameLower));
}
