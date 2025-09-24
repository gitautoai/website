import { isTestFile } from "./is-test-file";

describe("isTestFile", () => {
  describe("direct test file patterns", () => {
    it("should identify files with .test. pattern", () => {
      expect(isTestFile("Button.test.tsx")).toBe(true);
      expect(isTestFile("utils.test.js")).toBe(true);
      expect(isTestFile("api.test.ts")).toBe(true);
    });

    it("should identify files with .spec. pattern", () => {
      expect(isTestFile("Button.spec.tsx")).toBe(true);
      expect(isTestFile("api.spec.js")).toBe(true);
      expect(isTestFile("service.spec.ts")).toBe(true);
    });

    it("should identify files with test. pattern", () => {
      expect(isTestFile("ButtonTest.java")).toBe(true);
      expect(isTestFile("UserTest.cs")).toBe(true);
      expect(isTestFile("ApiTest.kt")).toBe(true);
    });

    it("should identify files with tests. pattern", () => {
      expect(isTestFile("ButtonTests.java")).toBe(true);
      expect(isTestFile("UserTests.cs")).toBe(true);
      expect(isTestFile("ApiTests.kt")).toBe(true);
    });

    it("should identify files with _test. pattern", () => {
      expect(isTestFile("button_test.py")).toBe(true);
      expect(isTestFile("user_test.go")).toBe(true);
      expect(isTestFile("api_test.rs")).toBe(true);
    });

    it("should identify files with _spec. pattern", () => {
      expect(isTestFile("button_spec.rb")).toBe(true);
      expect(isTestFile("user_spec.rb")).toBe(true);
      expect(isTestFile("api_spec.rb")).toBe(true);
    });
  });

  describe("test file prefix patterns", () => {
    it("should identify files starting with test_", () => {
      expect(isTestFile("test_button.py")).toBe(true);
      expect(isTestFile("test_utils.py")).toBe(true);
      expect(isTestFile("test_api.py")).toBe(true);
    });

    it("should identify files with /test_ in path", () => {
      expect(isTestFile("services/anthropic/test_client.py")).toBe(true);
      expect(isTestFile("utils/test_helpers.py")).toBe(true);
    });

    it("should identify files starting with spec_", () => {
      expect(isTestFile("spec_button.rb")).toBe(true);
      expect(isTestFile("spec_helper.rb")).toBe(true);
    });

    it("should identify files with /spec_ in path", () => {
      expect(isTestFile("services/anthropic/spec_client.py")).toBe(true);
      expect(isTestFile("utils/spec_helpers.rb")).toBe(true);
    });
  });

  describe("test directories", () => {
    it("should identify files in __tests__ directory", () => {
      expect(isTestFile("src/__tests__/Button.tsx")).toBe(true);
      expect(isTestFile("components/__tests__/Modal.tsx")).toBe(true);
    });

    it("should identify files in tests/test directories", () => {
      expect(isTestFile("src/tests/Button.tsx")).toBe(true);
      expect(isTestFile("src/test/Button.java")).toBe(true);
      expect(isTestFile("tests/constants.py")).toBe(true);
      expect(isTestFile("test/utils.py")).toBe(true);
    });

    it("should identify files in e2e directory", () => {
      expect(isTestFile("e2e/login.spec.ts")).toBe(true);
      expect(isTestFile("tests/e2e/checkout.test.ts")).toBe(true);
    });

    it("should identify files in cypress directory", () => {
      expect(isTestFile("cypress/integration/login.js")).toBe(true);
      expect(isTestFile("tests/cypress/e2e/checkout.cy.ts")).toBe(true);
    });

    it("should identify files in playwright directory", () => {
      expect(isTestFile("playwright/tests/login.spec.ts")).toBe(true);
      expect(isTestFile("tests/playwright/checkout.test.ts")).toBe(true);
    });

    it("should identify files in spec directory", () => {
      expect(isTestFile("spec/models/user_spec.rb")).toBe(true);
      expect(isTestFile("app/spec/services/api_spec.rb")).toBe(true);
    });

    it("should identify files in testing directory", () => {
      expect(isTestFile("testing/utils.py")).toBe(true);
      expect(isTestFile("src/testing/helpers.js")).toBe(true);
    });
  });

  describe("mock files", () => {
    it("should identify files in __mocks__ directory", () => {
      expect(isTestFile("src/__mocks__/api.js")).toBe(true);
      expect(isTestFile("components/__mocks__/Button.tsx")).toBe(true);
    });

    it("should identify files with .mock. pattern", () => {
      expect(isTestFile("api.mock.ts")).toBe(true);
      expect(isTestFile("database.mock.js")).toBe(true);
    });

    it("should identify files with mock. pattern", () => {
      expect(isTestFile("ApiMock.java")).toBe(true);
      expect(isTestFile("DatabaseMock.cs")).toBe(true);
    });

    it("should identify files with mocks. pattern", () => {
      expect(isTestFile("ApiMocks.java")).toBe(true);
      expect(isTestFile("DatabaseMocks.cs")).toBe(true);
    });
  });

  describe("common test file names", () => {
    it("should identify files starting with test.", () => {
      expect(isTestFile("test.js")).toBe(true);
      expect(isTestFile("test.py")).toBe(true);
    });

    it("should identify files starting with spec.", () => {
      expect(isTestFile("spec.rb")).toBe(true);
      expect(isTestFile("spec.js")).toBe(true);
    });
  });

  describe("ci/cd and infrastructure", () => {
    it("should identify files in .github directory", () => {
      expect(isTestFile(".github/scripts/test.sh")).toBe(true);
      expect(isTestFile(".github/workflows/ci.yml")).toBe(true);
    });
  });

  describe("case insensitive matching", () => {
    it("should handle case insensitive matching", () => {
      expect(isTestFile("Button.TEST.tsx")).toBe(true);
      expect(isTestFile("API.SPEC.js")).toBe(true);
      expect(isTestFile("USER_TEST.py")).toBe(true);
      expect(isTestFile("SRC/TESTS/Button.tsx")).toBe(true);
      expect(isTestFile("E2E/Login.spec.ts")).toBe(true);
    });
  });

  describe("non-test files", () => {
    it("should reject regular non-test files", () => {
      expect(isTestFile("Button.tsx")).toBe(false);
      expect(isTestFile("api.js")).toBe(false);
      expect(isTestFile("user.py")).toBe(false);
      expect(isTestFile("config.json")).toBe(false);
      expect(isTestFile("README.md")).toBe(false);
      expect(isTestFile("src/components/Button.tsx")).toBe(false);
      expect(isTestFile("utils/helpers.py")).toBe(false);
      expect(isTestFile("services/api.js")).toBe(false);
    });
  });

  describe("invalid input", () => {
    it("should handle invalid input types", () => {
      expect(isTestFile(null as any)).toBe(false);
      expect(isTestFile(123 as any)).toBe(false);
      expect(isTestFile([] as any)).toBe(false);
      expect(isTestFile({} as any)).toBe(false);
      expect(isTestFile("")).toBe(false);
    });
  });

  describe("edge cases", () => {
    it("should handle files that contain test-related words but do not match patterns", () => {
      // These should NOT be considered test files
      expect(isTestFile("latest.py")).toBe(false); // Contains "test" but not in pattern
      expect(isTestFile("context.js")).toBe(false); // Contains partial match
      expect(isTestFile("testing_utils.py")).toBe(false); // Contains "testing" but not in directory pattern
      expect(isTestFile("protest.js")).toBe(false); // Contains "test" but not in pattern
      expect(isTestFile("contest.py")).toBe(false); // Contains "test" but not in pattern
      expect(isTestFile("utils/files/is_test_file.py")).toBe(false); // Utility to detect tests, not a test
    });

    it("should handle files with paths correctly", () => {
      expect(isTestFile("src/components/Button.test.tsx")).toBe(true);
      expect(isTestFile("utils/test_helpers.py")).toBe(true);
      expect(isTestFile("deep/nested/path/__tests__/Component.test.js")).toBe(true);
      expect(isTestFile("very/long/path/to/test/file.spec.ts")).toBe(true);
    });
  });

  describe("boundary conditions", () => {
    it("should handle boundary conditions correctly", () => {
      expect(isTestFile("test")).toBe(false); // Just "test" without extension or pattern
      expect(isTestFile("spec")).toBe(false); // Just "spec" without extension or pattern
      expect(isTestFile("testing")).toBe(false); // Just "testing" without pattern
      expect(isTestFile(".test")).toBe(false); // Doesn't match .test. pattern
      expect(isTestFile("test.")).toBe(true); // Matches test. pattern
      expect(isTestFile("_test")).toBe(false); // Doesn't match _test. pattern
      expect(isTestFile("_test.")).toBe(true); // Matches _test. pattern
    });
  });

  describe("real world examples", () => {
    it("should handle real world test file examples", () => {
      expect(isTestFile("src/components/__tests__/Button.test.tsx")).toBe(true);
      expect(isTestFile("utils/files/test_is_code_file.py")).toBe(true);
      expect(isTestFile("cypress/e2e/login.cy.ts")).toBe(true);
      expect(isTestFile("playwright/tests/checkout.spec.ts")).toBe(true);
      expect(isTestFile("jest.config.js")).toBe(false); // Config file, not test
      expect(isTestFile("setupTests.js")).toBe(false); // Setup file, not test
      expect(isTestFile("testUtils.js")).toBe(false); // Utility file, not test
    });
  });
});
