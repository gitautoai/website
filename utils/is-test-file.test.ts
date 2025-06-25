import { isTestFile } from './is-test-file';

describe('isTestFile', () => {
  describe('Test file naming patterns', () => {
    it('should identify .test. files as test files', () => {
      expect(isTestFile('Button.test.tsx')).toBe(true);
      expect(isTestFile('utils.test.js')).toBe(true);
      expect(isTestFile('src/components/Button.test.tsx')).toBe(true);
    });

    it('should identify .spec. files as test files', () => {
      expect(isTestFile('Button.spec.tsx')).toBe(true);
      expect(isTestFile('api.spec.js')).toBe(true);
      expect(isTestFile('src/api/users.spec.ts')).toBe(true);
    });

    it('should identify Test. files as test files', () => {
      expect(isTestFile('ButtonTest.java')).toBe(true);
      expect(isTestFile('UserTest.cs')).toBe(true);
    });

    it('should identify Tests. files as test files', () => {
      expect(isTestFile('ButtonTests.java')).toBe(true);
      expect(isTestFile('UserTests.cs')).toBe(true);
    });

    it('should identify _test. files as test files', () => {
      expect(isTestFile('button_test.py')).toBe(true);
      expect(isTestFile('user_test.go')).toBe(true);
    });

    it('should identify _spec. files as test files', () => {
      expect(isTestFile('button_spec.rb')).toBe(true);
      expect(isTestFile('user_spec.rb')).toBe(true);
    });

    it('should identify test_ files as test files', () => {
      expect(isTestFile('test_button.py')).toBe(true);
      expect(isTestFile('test_utils.py')).toBe(true);
    });

    it('should identify spec_ files as test files', () => {
      expect(isTestFile('spec_button.rb')).toBe(true);
      expect(isTestFile('spec_helper.rb')).toBe(true);
    });
  });

  describe('Test directories', () => {
    it('should identify files in __tests__ directories as test files', () => {
      expect(isTestFile('src/__tests__/Button.tsx')).toBe(true);
      expect(isTestFile('__tests__/utils.js')).toBe(true);
    });

    it('should identify files in test/tests directories as test files', () => {
      expect(isTestFile('src/tests/Button.tsx')).toBe(true);
      expect(isTestFile('src/test/Button.java')).toBe(true);
      expect(isTestFile('tests/constants.py')).toBe(true);
      expect(isTestFile('test/utils.py')).toBe(true);
    });

    it('should identify files in e2e directories as test files', () => {
      expect(isTestFile('e2e/login.spec.ts')).toBe(true);
      expect(isTestFile('src/e2e/user-flow.test.ts')).toBe(true);
    });

    it('should identify files in cypress directories as test files', () => {
      expect(isTestFile('cypress/integration/login.js')).toBe(true);
    });

    it('should identify files in .github directories as test files', () => {
      expect(isTestFile('.github/scripts/test.js')).toBe(true);
      expect(isTestFile('.github/workflows/ci.yml')).toBe(true);
    });
  });

  describe('Mock files', () => {
    it('should identify mock files as test files', () => {
      expect(isTestFile('src/__mocks__/api.js')).toBe(true);
      expect(isTestFile('api.mock.ts')).toBe(true);
      expect(isTestFile('ApiMock.java')).toBe(true);
    });
  });

  describe('Non-test files', () => {
    it('should not identify regular files as test files', () => {
      expect(isTestFile('src/components/Button.tsx')).toBe(false);
      expect(isTestFile('utils/format-date.ts')).toBe(false);
      expect(isTestFile('app/api/users/route.ts')).toBe(false);
      expect(isTestFile('types/user.ts')).toBe(false); // This should be handled by isTypeFile
    });
  });
});