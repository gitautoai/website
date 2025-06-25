import { isCodeFile } from './is-code-file';
import { isTestFile } from './is-test-file';
import { isTypeFile } from './is-type-file';

describe('File Filtering Integration', () => {
  describe('Complete filtering logic', () => {
    it('should correctly categorize various file types', () => {
      const testFiles = [
        // Regular code files (should pass all filters)
        { path: 'src/components/Button.tsx', shouldInclude: true },
        { path: 'utils/format-date.ts', shouldInclude: true },
        { path: 'app/api/users/route.ts', shouldInclude: true },
        { path: 'lib/database.js', shouldInclude: true },
        { path: 'server/auth.py', shouldInclude: true },
        
        // Type files (should be excluded)
        { path: 'types/user.ts', shouldInclude: false },
        { path: 'src/types/api.d.ts', shouldInclude: false },
        { path: 'app/settings/types.ts', shouldInclude: false },
        { path: 'interfaces/database.ts', shouldInclude: false },
        { path: 'schema.graphql', shouldInclude: false },
        { path: 'user.proto', shouldInclude: false },
        { path: 'api.types.ts', shouldInclude: false },
        
        // Test files (should be excluded)
        { path: 'src/components/Button.test.tsx', shouldInclude: false },
        { path: 'utils/format-date.spec.ts', shouldInclude: false },
        { path: '__tests__/api.test.js', shouldInclude: false },
        { path: 'e2e/login.spec.ts', shouldInclude: false },
        { path: 'cypress/integration/user.js', shouldInclude: false },
        
        // Non-code files (should be excluded)
        { path: 'README.md', shouldInclude: false },
        { path: 'package.json', shouldInclude: false },
        { path: 'style.css', shouldInclude: false },
        { path: 'index.html', shouldInclude: false },
        { path: 'image.png', shouldInclude: false },
        
        // Edge cases
        { path: 'types.js', shouldInclude: true }, // Not in types directory, just named types
        { path: 'test.py', shouldInclude: true }, // Not a test file, just named test
        { path: 'interface.go', shouldInclude: true }, // Not in interfaces directory
      ];

      testFiles.forEach(({ path, shouldInclude }) => {
        const isCode = isCodeFile(path);
        const isTest = isTestFile(path);
        const isType = isTypeFile(path);
        
        // Apply the same filtering logic as fetchRepositoryFiles
        const wouldBeIncluded = isCode && !isTest && !isType;
        
        expect(wouldBeIncluded).toBe(shouldInclude, 
          `File "${path}" should ${shouldInclude ? 'be included' : 'be excluded'} but got ${wouldBeIncluded}. ` +
          `isCode: ${isCode}, isTest: ${isTest}, isType: ${isType}`
        );
      });
    });
  });

  describe('Priority of exclusions', () => {
    it('should handle files that match multiple exclusion criteria', () => {
      const ambiguousFiles = [
        // Files that could be both type and test files
        'types/user.test.ts', // Type directory + test file
        'src/types/api.spec.ts', // Type directory + test file
        '__tests__/types.ts', // Test directory + type file name
        'interfaces/user.test.ts', // Interface directory + test file
      ];

      ambiguousFiles.forEach(path => {
        const isCode = isCodeFile(path);
        const isTest = isTestFile(path);
        const isType = isTypeFile(path);
        
        // These files should be excluded regardless of which filter catches them
        const wouldBeIncluded = isCode && !isTest && !isType;
        
        expect(wouldBeIncluded).toBe(false, 
          `File "${path}" should be excluded. isCode: ${isCode}, isTest: ${isTest}, isType: ${isType}`
        );
        
        // At least one exclusion filter should catch it
        expect(isTest || isType).toBe(true, 
          `File "${path}" should be caught by at least one exclusion filter`
        );
      });
    });
  });
});