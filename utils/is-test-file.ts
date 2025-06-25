/*
 * Determines whether a given file path corresponds to a test file.
 * This function checks for common test file naming patterns including:
 * .test., .spec., Test, Tests, _test, _spec, test_, spec_, or being in test directories like __tests__, tests, cypress, e2e, etc.
 */

const TEST_FILE_PATTERNS = [
  /[._-]test\.[jt]sx?$/i,              // foo.test.js, foo-test.tsx, etc.
  /[._-]spec\.[jt]sx?$/i,              // foo.spec.js, foo-spec.tsx, etc.
  /Test\.[jt]sx?$/i,                   // FooTest.js
  /Tests\.[jt]sx?$/i,                  // FooTests.js
  /^test[_-]/i,                        // test_foo.js
  /^spec[_-]/i,                        // spec_foo.js
  /[\/]__tests__[\/]/,               // any file within __tests__ directory
  /[\/]tests?[\/]/,                  // tests or test directory
  /[\/]e2e[\/]/,                     // e2e directory
  /[\/]cypress[\/]/,                 // cypress directory
  /[\/]playwright[\/]/,              // playwright directory
  /[\/]testing[\/]/,                 // testing directory
  /[\/]mock[s]?[\/]/i                // mocks directories
];

export function isTestFile(filePath: string): boolean {
  // Special case: if the file name is exactly 'test.py', consider it as code file
  if (filePath === 'test.py') {
    return false;
  }

  return TEST_FILE_PATTERNS.some((pattern) => pattern.test(filePath));
}
